// One-shot generator for the portfolio content types.
// Derived from the content models in the Claude Design prototype
// (directions/editorial.jsx). Safe to re-run: overwrites schema files.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const write = (rel, content) => {
  const abs = join(root, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content);
  console.log('wrote', rel);
};

const json = (obj) => JSON.stringify(obj, null, 2) + '\n';

// ── Components ──────────────────────────────────────────────
const components = {
  'shared/metric': {
    collectionName: 'components_shared_metrics',
    info: { displayName: 'Metric', description: 'Value/label pair, e.g. "14" / "brands"' },
    options: {},
    attributes: {
      value: { type: 'string', required: true },
      label: { type: 'string', required: true },
    },
  },
  'shared/tag': {
    collectionName: 'components_shared_tags',
    info: { displayName: 'Tag', description: 'Simple label used for tags and tech-stack chips' },
    options: {},
    attributes: {
      label: { type: 'string', required: true },
    },
  },
  'shared/social-link': {
    collectionName: 'components_shared_social_links',
    info: { displayName: 'Social link' },
    options: {},
    attributes: {
      label: { type: 'string', required: true },
      url: { type: 'string', required: true },
    },
  },
  'shared/stat': {
    collectionName: 'components_shared_stats',
    info: { displayName: 'Stat', description: 'Flip-card stat: big number, label, sublabel, hover context' },
    options: {},
    attributes: {
      value: { type: 'string', required: true },
      label: { type: 'string', required: true },
      sublabel: { type: 'string' },
      context: { type: 'text' },
    },
  },
  'shared/agenda-item': {
    collectionName: 'components_shared_agenda_items',
    info: { displayName: 'Agenda item', description: '"This week" hero list item' },
    options: {},
    attributes: {
      text: { type: 'text', required: true },
      highlight: { type: 'boolean', default: false },
    },
  },
  'shared/pillar': {
    collectionName: 'components_shared_pillars',
    info: { displayName: 'Pillar', description: 'Titled statement block ("How I work" items)' },
    options: {},
    attributes: {
      title: { type: 'string', required: true },
      body: { type: 'text', required: true },
    },
  },
  'article/section': {
    collectionName: 'components_article_sections',
    info: { displayName: 'Article section', description: 'Numbered heading + body block' },
    options: {},
    attributes: {
      heading: { type: 'string', required: true },
      kicker: { type: 'string', description: 'Optional mono label above the heading (fix pages)' },
      body: { type: 'richtext', required: true },
    },
  },
  'article/quote': {
    collectionName: 'components_article_quotes',
    info: { displayName: 'Block quote', description: 'Editorial pull quote with optional attribution' },
    options: {},
    attributes: {
      text: { type: 'text', required: true },
      attribution: { type: 'string' },
    },
  },
  'article/code': {
    collectionName: 'components_article_codes',
    info: { displayName: 'Code block', description: 'Dark mono code block with optional language and title' },
    options: {},
    attributes: {
      code: { type: 'text', required: true },
      language: { type: 'string', description: 'e.g. "ts", "bash"' },
      title: { type: 'string', description: 'Optional label, e.g. a filename' },
    },
  },
  'article/image': {
    collectionName: 'components_article_images',
    info: { displayName: 'Image', description: 'Full-width article image with optional caption' },
    options: {},
    attributes: {
      image: { type: 'media', multiple: false, required: true, allowedTypes: ['images'] },
      caption: { type: 'text' },
    },
  },
  'fix/aspect': {
    collectionName: 'components_fix_aspects',
    info: {
      displayName: 'Fix aspect',
      description: 'Labelled paragraph inside a cause: "Symptom.", "How to confirm.", "The fix.", …',
    },
    options: {},
    attributes: {
      label: { type: 'string', required: true, description: 'e.g. "Symptom"' },
      body: { type: 'text', required: true, description: 'Supports [text](url) links and `inline code`' },
      code: { type: 'text', description: 'Optional code sample rendered after the body' },
      codeLanguage: { type: 'string', description: 'e.g. "bash"' },
      after: { type: 'text', description: 'Optional paragraph rendered after the code sample' },
    },
  },
  'fix/cause': {
    collectionName: 'components_fix_causes',
    info: {
      displayName: 'Fix cause',
      description: 'Numbered likely cause with its labelled aspects, most common first',
    },
    options: {},
    attributes: {
      title: { type: 'string', required: true },
      likelihood: {
        type: 'integer',
        min: 1,
        max: 5,
        description: 'How often this is the answer, 1–5 (drives the bars on the cause selector)',
      },
      aspects: { type: 'component', repeatable: true, component: 'fix.aspect' },
    },
  },
  'fix/qa': {
    collectionName: 'components_fix_qas',
    info: { displayName: 'Fix Q&A', description: 'One common question and its answer' },
    options: {},
    attributes: {
      question: { type: 'string', required: true },
      answer: { type: 'text', required: true },
    },
  },
  'fix/faq': {
    collectionName: 'components_fix_faqs',
    info: { displayName: 'Fix FAQ block', description: 'Common questions section on a fix page' },
    options: {},
    attributes: {
      heading: { type: 'string', default: 'Common questions' },
      items: { type: 'component', repeatable: true, component: 'fix.qa' },
    },
  },
  'fix/note': {
    collectionName: 'components_fix_notes',
    info: {
      displayName: 'Fix note',
      description: 'Unheaded prose between blocks. Supports [text](url) links and `inline code`',
    },
    options: {},
    attributes: {
      body: { type: 'text', required: true },
      tone: {
        type: 'enumeration',
        enum: ['plain', 'warning'],
        default: 'plain',
        description: '"warning" renders as the ! callout panel',
      },
    },
  },
};

for (const [path, schema] of Object.entries(components)) {
  write(`src/components/${path}.json`, json(schema));
}

// ── APIs ────────────────────────────────────────────────────
const apis = {
  project: {
    kind: 'collectionType',
    collectionName: 'projects',
    info: {
      singularName: 'project',
      pluralName: 'projects',
      displayName: 'Project',
      description: 'Case study / engagement shown on the Work index and case-study pages',
    },
    options: { draftAndPublish: true },
    attributes: {
      name: { type: 'string', required: true },
      slug: { type: 'uid', targetField: 'name', required: true },
      client: { type: 'string', description: 'e.g. "DTC fashion group · 14 brands"' },
      stack: { type: 'string', description: 'Short stack summary, e.g. "Strapi 5 · Next.js 15 · Vercel"' },
      year: { type: 'string' },
      role: { type: 'string' },
      summary: { type: 'text', description: 'One-paragraph note shown on the work index row' },
      featured: { type: 'boolean', default: false },
      challenge: { type: 'text' },
      approach: { type: 'text' },
      outcome: { type: 'text' },
      metrics: { type: 'component', repeatable: true, component: 'shared.metric' },
      tags: { type: 'component', repeatable: true, component: 'shared.tag' },
      order: { type: 'integer', default: 0 },
    },
  },
  topic: {
    kind: 'collectionType',
    collectionName: 'topics',
    info: {
      singularName: 'topic',
      pluralName: 'topics',
      displayName: 'Topic',
      description: 'Writing topic used for the blog filter (Strapi, Architecture, Next.js…)',
    },
    options: { draftAndPublish: false },
    attributes: {
      name: { type: 'string', required: true },
      slug: { type: 'uid', targetField: 'name', required: true },
      articles: { type: 'relation', relation: 'oneToMany', target: 'api::article.article', mappedBy: 'topic' },
    },
  },
  article: {
    kind: 'collectionType',
    collectionName: 'articles',
    info: {
      singularName: 'article',
      pluralName: 'articles',
      displayName: 'Article',
      description: 'Blog post with structured sections and a pull quote',
    },
    options: { draftAndPublish: true },
    attributes: {
      title: { type: 'string', required: true },
      slug: { type: 'uid', targetField: 'title', required: true },
      date: { type: 'date', required: true },
      readingTime: { type: 'string', description: 'e.g. "12 min"' },
      excerpt: { type: 'text' },
      featured: { type: 'boolean', default: false },
      topic: { type: 'relation', relation: 'manyToOne', target: 'api::topic.topic', inversedBy: 'articles' },
      intro: { type: 'text', description: 'Standfirst / opening paragraph' },
      blocks: {
        type: 'dynamiczone',
        components: ['article.section', 'article.quote', 'article.code', 'article.image'],
      },
      externalUrl: { type: 'string', description: 'When set, the article links out instead of rendering locally' },
      publisher: { type: 'string', description: 'e.g. "strapi.io" for vendor-published pieces' },
    },
  },
  'fix-category': {
    kind: 'collectionType',
    collectionName: 'fix_categories',
    info: {
      singularName: 'fix-category',
      pluralName: 'fix-categories',
      displayName: 'Fix category',
      description: 'Grouping on the Fixes hub (Performance, Content architecture, Before you launch)',
    },
    options: { draftAndPublish: false },
    attributes: {
      name: { type: 'string', required: true },
      slug: { type: 'uid', targetField: 'name', required: true },
      description: { type: 'text', description: 'One-liner under the category heading on the hub' },
      order: { type: 'integer', default: 0 },
      fixPages: {
        type: 'relation',
        relation: 'oneToMany',
        target: 'api::fix-page.fix-page',
        mappedBy: 'category',
      },
    },
  },
  'fix-page': {
    kind: 'collectionType',
    collectionName: 'fix_pages',
    info: {
      singularName: 'fix-page',
      pluralName: 'fix-pages',
      displayName: 'Fix page',
      description: 'Diagnostic page under /fixes — one symptom, likely causes in order',
    },
    options: { draftAndPublish: true },
    attributes: {
      title: { type: 'string', required: true },
      slug: { type: 'uid', targetField: 'title', required: true },
      seoTitle: { type: 'string', description: 'Title tag; falls back to title' },
      seoDescription: { type: 'text' },
      lede: { type: 'text', description: 'Opening paragraph / standfirst' },
      hubSummary: { type: 'text', description: 'One-liner shown under the title on the hub' },
      category: {
        type: 'relation',
        relation: 'manyToOne',
        target: 'api::fix-category.fix-category',
        inversedBy: 'fixPages',
      },
      blocks: {
        type: 'dynamiczone',
        components: ['article.section', 'article.code', 'article.quote', 'fix.cause', 'fix.faq', 'fix.note'],
      },
      readingTime: { type: 'string', description: 'e.g. "11 min"' },
      symptoms: {
        type: 'component',
        repeatable: true,
        component: 'shared.tag',
        description: 'Symptom chips on the hub row',
      },
      reviewed: { type: 'string', description: 'e.g. "Sep 2026"' },
      reviewedAgainst: { type: 'string', description: 'e.g. "Strapi 5"' },
      ctaKicker: { type: 'string', description: 'e.g. "Diagnosed everything and still stuck?"' },
      ctaText: { type: 'text', description: 'Supporting line under the CTA title' },
      ctaLabel: { type: 'string', description: 'Button label, e.g. "See the rescue scope"' },
      service: { type: 'relation', relation: 'oneToOne', target: 'api::service.service' },
      order: { type: 'integer', default: 0 },
    },
  },
  'fixes-hub': {
    kind: 'singleType',
    collectionName: 'fixes_hubs',
    info: {
      singularName: 'fixes-hub',
      pluralName: 'fixes-hubs',
      displayName: 'Fixes hub',
      description: 'Copy for the /fixes hub page',
    },
    options: { draftAndPublish: false },
    attributes: {
      seoTitle: { type: 'string' },
      seoDescription: { type: 'text' },
      heading: { type: 'string', description: 'e.g. "Fixes"' },
      tagline: { type: 'text', description: 'Hero headline, e.g. "Diagnostics for Strapi builds that aren\'t behaving."' },
      taglineHighlight: {
        type: 'string',
        description: 'Substring of tagline rendered in accent, e.g. "aren\'t behaving."',
      },
      intro: { type: 'text', description: 'Intro paragraphs, separated by blank lines' },
      stepsHeading: { type: 'string', description: 'Dark panel heading, e.g. "How these pages work"' },
      steps: {
        type: 'component',
        repeatable: true,
        component: 'shared.pillar',
        description: 'Numbered rows in the dark hero panel (Symptom / Causes / Confirm / Fix)',
      },
      stepsNote: { type: 'text', description: 'Footer line of the dark hero panel' },
      closingNote: { type: 'text', description: '"Living pages" note above the CTA' },
      ctaText: { type: 'text', description: 'Pitch line for the service CTA' },
      service: { type: 'relation', relation: 'oneToOne', target: 'api::service.service' },
    },
  },
  service: {
    kind: 'collectionType',
    collectionName: 'services',
    info: {
      singularName: 'service',
      pluralName: 'services',
      displayName: 'Service',
      description: 'Engagement type shown on the Services page and home rate card',
    },
    options: { draftAndPublish: true },
    attributes: {
      code: { type: 'string', description: 'e.g. "S/01"' },
      name: { type: 'string', required: true },
      description: { type: 'text' },
      bestFor: { type: 'text', description: '"Best for" guidance shown on the Services page' },
      format: { type: 'string', description: 'Engagement format, e.g. "Fixed scope", "Retained"' },
      typical: { type: 'string', description: 'Typical length, e.g. "1–3 weeks"' },
      credential: { type: 'text', description: 'Optional proof line, e.g. relevant past role' },
      order: { type: 'integer', default: 0 },
    },
  },
  experience: {
    kind: 'collectionType',
    collectionName: 'experiences',
    info: {
      singularName: 'experience',
      pluralName: 'experiences',
      displayName: 'Experience',
      description: 'Career timeline entry on the About page',
    },
    options: { draftAndPublish: false },
    attributes: {
      years: { type: 'string', required: true, description: 'e.g. "2024→" or "2021–24"' },
      role: { type: 'string', required: true },
      organisation: { type: 'string' },
      description: { type: 'text' },
      stack: { type: 'component', repeatable: true, component: 'shared.tag' },
      order: { type: 'integer', default: 0 },
    },
  },
  'process-phase': {
    kind: 'collectionType',
    collectionName: 'process_phases',
    info: {
      singularName: 'process-phase',
      pluralName: 'process-phases',
      displayName: 'Process phase',
      description: 'Five-phase engagement process on the Services page',
    },
    options: { draftAndPublish: false },
    attributes: {
      step: { type: 'string', description: 'e.g. "01"' },
      week: { type: 'string', description: 'e.g. "Wk 1–2"' },
      title: { type: 'string', required: true },
      description: { type: 'text' },
      order: { type: 'integer', default: 0 },
    },
  },
  faq: {
    kind: 'collectionType',
    collectionName: 'faqs',
    info: {
      singularName: 'faq',
      pluralName: 'faqs',
      displayName: 'FAQ',
      description: 'Services page FAQ entries',
    },
    options: { draftAndPublish: false },
    attributes: {
      question: { type: 'string', required: true },
      answer: { type: 'text', required: true },
      order: { type: 'integer', default: 0 },
    },
  },
  principle: {
    kind: 'collectionType',
    collectionName: 'principles',
    info: {
      singularName: 'principle',
      pluralName: 'principles',
      displayName: 'Principle',
      description: 'Operating principles on the About page (numbered I–IV)',
    },
    options: { draftAndPublish: false },
    attributes: {
      numeral: { type: 'string', description: 'Roman numeral, e.g. "II"' },
      title: { type: 'string', required: true },
      description: { type: 'text' },
      order: { type: 'integer', default: 0 },
    },
  },
  book: {
    kind: 'collectionType',
    collectionName: 'books',
    info: {
      singularName: 'book',
      pluralName: 'books',
      displayName: 'Book',
      description: 'Reading shelf on the About page',
    },
    options: { draftAndPublish: false },
    attributes: {
      title: { type: 'string', required: true },
      author: { type: 'string', required: true },
      note: { type: 'text' },
      order: { type: 'integer', default: 0 },
    },
  },
  activity: {
    kind: 'collectionType',
    collectionName: 'activities',
    info: {
      singularName: 'activity',
      pluralName: 'activities',
      displayName: 'Activity',
      description: 'Home page live feed entry (deploys, releases, commits)',
    },
    options: { draftAndPublish: false },
    attributes: {
      repo: { type: 'string', required: true },
      message: { type: 'string', required: true },
      branch: { type: 'string' },
      occurredAt: { type: 'datetime' },
      highlight: { type: 'boolean', default: false, description: 'Accent-coloured entry in the feed' },
    },
  },
  testimonial: {
    kind: 'collectionType',
    collectionName: 'testimonials',
    info: {
      singularName: 'testimonial',
      pluralName: 'testimonials',
      displayName: 'Testimonial',
      description: 'Pull-quote testimonials',
    },
    options: { draftAndPublish: true },
    attributes: {
      quote: { type: 'text', required: true },
      author: { type: 'string', required: true },
      role: { type: 'string', description: 'e.g. "VP Engineering"' },
      company: { type: 'string' },
      year: { type: 'string' },
      featured: { type: 'boolean', default: false },
    },
  },
  global: {
    kind: 'singleType',
    collectionName: 'globals',
    info: {
      singularName: 'global',
      pluralName: 'globals',
      displayName: 'Global',
      description: 'Site-wide profile, availability, socials, stack and newsletter copy',
    },
    options: { draftAndPublish: false },
    attributes: {
      name: { type: 'string', required: true },
      jobTitle: { type: 'string', description: 'e.g. "technical lead"' },
      email: { type: 'email' },
      location: { type: 'string', description: 'e.g. "Bristol, UK"' },
      timezone: { type: 'string', description: 'e.g. "BST · GMT+1"' },
      available: { type: 'boolean', default: true },
      availabilityNote: { type: 'string', description: 'e.g. "booking into Q4 2026"' },
      socialLinks: { type: 'component', repeatable: true, component: 'shared.social-link' },
      stack: { type: 'component', repeatable: true, component: 'shared.tag' },
      newsletterHeading: { type: 'string' },
      newsletterText: { type: 'text' },
    },
  },
  'contact-message': {
    kind: 'collectionType',
    collectionName: 'contact_messages',
    info: {
      singularName: 'contact-message',
      pluralName: 'contact-messages',
      displayName: 'Contact message',
      description: 'Enquiries submitted through the site contact form',
    },
    options: { draftAndPublish: false },
    attributes: {
      name: { type: 'string', required: true, maxLength: 200 },
      email: { type: 'email', required: true },
      message: { type: 'text', required: true, maxLength: 5000 },
    },
  },
  'newsletter-subscriber': {
    kind: 'collectionType',
    collectionName: 'newsletter_subscribers',
    info: {
      singularName: 'newsletter-subscriber',
      pluralName: 'newsletter-subscribers',
      displayName: 'Newsletter subscriber',
      description: 'Signups from the newsletter form',
    },
    options: { draftAndPublish: false },
    attributes: {
      email: { type: 'email', required: true, unique: true },
    },
  },
  homepage: {
    kind: 'singleType',
    collectionName: 'homepages',
    info: {
      singularName: 'homepage',
      pluralName: 'homepages',
      displayName: 'Homepage',
      description: 'Home hero, flip-card stats, this-week list, featured project and testimonial',
    },
    options: { draftAndPublish: true },
    attributes: {
      seoTitle: { type: 'string', description: 'Title tag; keyword first, brand at the end' },
      seoDescription: { type: 'text', description: 'Meta description, ~150 chars' },
      heroHeadline: { type: 'text', description: 'First hero line (ink)' },
      heroAccent: { type: 'text', description: 'Second hero line' },
      heroHighlight: { type: 'string', description: 'Substring of heroAccent to render in accent with the underline' },
      lede: { type: 'text' },
      footnote: { type: 'text', description: 'Italic footnote under the lede' },
      stats: { type: 'component', repeatable: true, component: 'shared.stat' },
      thisWeek: { type: 'component', repeatable: true, component: 'shared.agenda-item' },
      howIWork: { type: 'component', repeatable: true, component: 'shared.pillar' },
      featuredProject: { type: 'relation', relation: 'oneToOne', target: 'api::project.project' },
      testimonial: { type: 'relation', relation: 'oneToOne', target: 'api::testimonial.testimonial' },
    },
  },
};

const coreFile = (kind, api) =>
  `import { factories } from '@strapi/strapi';\n\nexport default factories.createCore${kind}('api::${api}.${api}');\n`;

for (const [api, schema] of Object.entries(apis)) {
  write(`src/api/${api}/content-types/${schema.info.singularName}/schema.json`, json(schema));
  write(`src/api/${api}/routes/${api}.ts`, coreFile('Router', api));
  write(`src/api/${api}/controllers/${api}.ts`, coreFile('Controller', api));
  write(`src/api/${api}/services/${api}.ts`, coreFile('Service', api));
}

console.log('\nDone.');
