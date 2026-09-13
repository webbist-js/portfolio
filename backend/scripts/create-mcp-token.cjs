// Creates (or recreates) the "claude-code-mcp" admin token used by the
// Strapi MCP server. Run with the dev server STOPPED (SQLite):
//   node scripts/create-mcp-token.cjs
// Prints the access key — shown only once per creation.
const { createStrapi, compileStrapi } = require('@strapi/strapi');

const TOKEN_NAME = 'claude-code-mcp';

async function main() {
  const ctx = await compileStrapi();
  const app = await createStrapi(ctx).load();
  app.log.level = 'error';

  const user = await app.db
    .query('admin::user')
    .findOne({ where: { isActive: true }, orderBy: { id: 'asc' }, populate: ['roles'] });
  if (!user) throw new Error('No active admin user found — create one at /admin first.');

  const tokenService = app.admin.services['api-token-admin'];

  const existing = await app.db.query('admin::api-token').findOne({ where: { name: TOKEN_NAME } });
  if (existing) {
    await tokenService.revoke(existing.id);
    console.log(`Revoked previous "${TOKEN_NAME}" token.`);
  }

  // Content-manager permissions over every app content type; publish only
  // where Draft & Publish is enabled.
  const actions = ['create', 'read', 'update', 'delete'];
  const adminPermissions = [];
  for (const [uid, contentType] of Object.entries(app.contentTypes)) {
    if (!uid.startsWith('api::')) continue;
    for (const action of actions) {
      adminPermissions.push({ action: `plugin::content-manager.explorer.${action}`, subject: uid });
    }
    if (contentType.options?.draftAndPublish) {
      adminPermissions.push({ action: 'plugin::content-manager.explorer.publish', subject: uid });
    }
  }

  const created = await tokenService.create(
    {
      name: TOKEN_NAME,
      description: 'MCP access for Claude Code (local dev)',
      kind: 'admin',
      lifespan: null,
      adminPermissions,
    },
    user
  );

  console.log(`Token "${TOKEN_NAME}" created for ${user.email} (${adminPermissions.length} permissions).`);
  console.log(`ACCESS_KEY=${created.accessKey}`);
  await app.destroy();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
