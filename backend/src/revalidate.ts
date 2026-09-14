import type { Core } from '@strapi/strapi';

type Entry = { model: string; slug?: string };

const PUBLISH_ACTIONS = new Set(['publish', 'unpublish', 'delete']);
const WRITE_ACTIONS = new Set(['create', 'update']);
const FLUSH_MS = 1500;

/** Only changes that alter *published* content should purge the site. */
export function shouldRevalidate(
  action: string,
  hasDraftAndPublish: boolean,
  status?: string
): boolean {
  if (PUBLISH_ACTIONS.has(action)) return true;
  if (WRITE_ACTIONS.has(action)) return !hasDraftAndPublish || status === 'published';
  return false;
}

const pickSlug = (result: unknown, params: unknown): string | undefined => {
  const r = result as { slug?: unknown; entries?: Array<{ slug?: unknown }> } | undefined;
  const p = params as { data?: { slug?: unknown } } | undefined;
  const slug = r?.slug ?? r?.entries?.[0]?.slug ?? p?.data?.slug;
  return typeof slug === 'string' ? slug : undefined;
};

/**
 * Registers a document-service middleware that batches content changes and
 * POSTs them to the frontend's /api/revalidate. No-op when env is unset.
 */
export function registerRevalidation(strapi: Core.Strapi, apis: string[]) {
  const url = process.env.FRONTEND_REVALIDATE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!url || !secret) {
    strapi.log.info('revalidate: FRONTEND_REVALIDATE_URL / REVALIDATE_SECRET unset — purge disabled');
    return;
  }

  const uids = new Set(apis.map((a) => `api::${a}.${a}`));
  const pending = new Map<string, Entry>();
  let timer: NodeJS.Timeout | null = null;

  const flush = async () => {
    timer = null;
    const entries = [...pending.values()];
    pending.clear();
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${secret}` },
        body: JSON.stringify({ entries }),
      });
      if (!res.ok) {
        strapi.log.warn(`revalidate: frontend responded ${res.status}`);
        return;
      }
      const body = (await res.json()) as { revalidated?: string[]; failed?: string[] };
      strapi.log.info(
        `revalidate: purged ${body.revalidated?.length ?? 0} paths, ${body.failed?.length ?? 0} failed`
      );
    } catch (err) {
      strapi.log.warn(`revalidate: request failed — ${(err as Error).message}`);
    }
  };

  const enqueue = (entry: Entry) => {
    pending.set(`${entry.model}:${entry.slug ?? ''}`, entry);
    if (!timer) timer = setTimeout(flush, FLUSH_MS);
  };

  strapi.documents.use(async (ctx, next) => {
    const result = await next();
    if (!uids.has(ctx.uid)) return result;

    const contentType = strapi.contentTypes[ctx.uid];
    const hasDraftAndPublish = Boolean(contentType?.options?.draftAndPublish);
    const status = (ctx.params as { status?: string } | undefined)?.status;
    if (shouldRevalidate(ctx.action, hasDraftAndPublish, status)) {
      // api::project.project → project
      enqueue({ model: ctx.uid.split('.').pop() as string, slug: pickSlug(result, ctx.params) });
    }
    return result;
  });
}
