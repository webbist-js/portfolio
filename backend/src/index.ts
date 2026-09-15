import type { Core } from '@strapi/strapi';
import { registerRevalidation } from './revalidate';

// Content read by the public site. find/findOne is granted to the Public
// role on every boot so the SvelteKit frontend works without an API token.
const PUBLIC_READ_APIS = [
  'project',
  'topic',
  'article',
  'fix-page',
  'fix-category',
  'fixes-hub',
  'service',
  'experience',
  'process-phase',
  'faq',
  'principle',
  'book',
  'activity',
  'testimonial',
  'global',
  'homepage',
];

// Form endpoints: the public role may create entries but never read them.
const PUBLIC_CREATE_APIS = ['contact-message', 'newsletter-subscriber'];

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    registerRevalidation(strapi, PUBLIC_READ_APIS);
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const publicRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });
    if (!publicRole) return;

    const grants: Array<[string, string[]]> = [
      ...PUBLIC_READ_APIS.map((api): [string, string[]] => {
        const uid = `api::${api}.${api}`;
        const contentType = strapi.contentTypes[uid as keyof typeof strapi.contentTypes];
        return [api, contentType?.kind === 'singleType' ? ['find'] : ['find', 'findOne']];
      }),
      ...PUBLIC_CREATE_APIS.map((api): [string, string[]] => [api, ['create']]),
    ];

    for (const [api, actions] of grants) {
      const uid = `api::${api}.${api}`;
      if (!strapi.contentTypes[uid as keyof typeof strapi.contentTypes]) continue;

      for (const action of actions) {
        const actionId = `${uid}.${action}`;
        const existing = await strapi.db
          .query('plugin::users-permissions.permission')
          .findOne({ where: { action: actionId, role: publicRole.id } });
        if (!existing) {
          await strapi.db.query('plugin::users-permissions.permission').create({
            data: { action: actionId, role: publicRole.id },
          });
        }
      }
    }
  },
};
