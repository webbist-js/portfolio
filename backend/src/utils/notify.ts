// Sends a notification email for form submissions. No-ops (with a warning)
// when no email provider is configured, so submissions are never blocked
// by mail failures — the entry is already stored by the time this runs.
export async function notify(subject: string, text: string) {
  const to = process.env.EMAIL_TO || 'info@alex-bennett.co.uk';
  if (!process.env.SENDGRID_API_KEY) {
    strapi.log.warn(`[notify] SENDGRID_API_KEY not set — skipping email "${subject}" to ${to}`);
    return;
  }
  try {
    await strapi.plugin('email').service('email').send({ to, subject, text });
  } catch (err) {
    strapi.log.error(`[notify] failed to send "${subject}": ${err instanceof Error ? err.message : err}`);
  }
}
