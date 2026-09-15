import type { Schema, Struct } from '@strapi/strapi';

export interface ArticleCode extends Struct.ComponentSchema {
  collectionName: 'components_article_codes';
  info: {
    description: 'Dark mono code block with optional language and title';
    displayName: 'Code block';
  };
  attributes: {
    code: Schema.Attribute.Text & Schema.Attribute.Required;
    language: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface ArticleImage extends Struct.ComponentSchema {
  collectionName: 'components_article_images';
  info: {
    description: 'Full-width article image with optional caption';
    displayName: 'Image';
  };
  attributes: {
    caption: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface ArticleQuote extends Struct.ComponentSchema {
  collectionName: 'components_article_quotes';
  info: {
    description: 'Editorial pull quote with optional attribution';
    displayName: 'Block quote';
  };
  attributes: {
    attribution: Schema.Attribute.String;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface ArticleSection extends Struct.ComponentSchema {
  collectionName: 'components_article_sections';
  info: {
    description: 'Numbered heading + body block';
    displayName: 'Article section';
  };
  attributes: {
    body: Schema.Attribute.RichText & Schema.Attribute.Required;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    kicker: Schema.Attribute.String;
  };
}

export interface FixAspect extends Struct.ComponentSchema {
  collectionName: 'components_fix_aspects';
  info: {
    description: 'Labelled paragraph inside a cause: "Symptom.", "How to confirm.", "The fix.", \u2026';
    displayName: 'Fix aspect';
  };
  attributes: {
    after: Schema.Attribute.Text;
    body: Schema.Attribute.Text & Schema.Attribute.Required;
    code: Schema.Attribute.Text;
    codeLanguage: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FixCause extends Struct.ComponentSchema {
  collectionName: 'components_fix_causes';
  info: {
    description: 'Numbered likely cause with its labelled aspects, most common first';
    displayName: 'Fix cause';
  };
  attributes: {
    aspects: Schema.Attribute.Component<'fix.aspect', true>;
    likelihood: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FixFaq extends Struct.ComponentSchema {
  collectionName: 'components_fix_faqs';
  info: {
    description: 'Common questions section on a fix page';
    displayName: 'Fix FAQ block';
  };
  attributes: {
    heading: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Common questions'>;
    items: Schema.Attribute.Component<'fix.qa', true>;
  };
}

export interface FixNote extends Struct.ComponentSchema {
  collectionName: 'components_fix_notes';
  info: {
    description: 'Unheaded prose between blocks. Supports [text](url) links and `inline code`';
    displayName: 'Fix note';
  };
  attributes: {
    body: Schema.Attribute.Text & Schema.Attribute.Required;
    tone: Schema.Attribute.Enumeration<['plain', 'warning']> &
      Schema.Attribute.DefaultTo<'plain'>;
  };
}

export interface FixQa extends Struct.ComponentSchema {
  collectionName: 'components_fix_qas';
  info: {
    description: 'One common question and its answer';
    displayName: 'Fix Q&A';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedAgendaItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_agenda_items';
  info: {
    description: '"This week" hero list item';
    displayName: 'Agenda item';
  };
  attributes: {
    highlight: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SharedMetric extends Struct.ComponentSchema {
  collectionName: 'components_shared_metrics';
  info: {
    description: 'Value/label pair, e.g. "14" / "brands"';
    displayName: 'Metric';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedPillar extends Struct.ComponentSchema {
  collectionName: 'components_shared_pillars';
  info: {
    description: 'Titled statement block ("How I work" items)';
    displayName: 'Pillar';
  };
  attributes: {
    body: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    displayName: 'Social link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedStat extends Struct.ComponentSchema {
  collectionName: 'components_shared_stats';
  info: {
    description: 'Flip-card stat: big number, label, sublabel, hover context';
    displayName: 'Stat';
  };
  attributes: {
    context: Schema.Attribute.Text;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    sublabel: Schema.Attribute.String;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedTag extends Struct.ComponentSchema {
  collectionName: 'components_shared_tags';
  info: {
    description: 'Simple label used for tags and tech-stack chips';
    displayName: 'Tag';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'article.code': ArticleCode;
      'article.image': ArticleImage;
      'article.quote': ArticleQuote;
      'article.section': ArticleSection;
      'fix.aspect': FixAspect;
      'fix.cause': FixCause;
      'fix.faq': FixFaq;
      'fix.note': FixNote;
      'fix.qa': FixQa;
      'shared.agenda-item': SharedAgendaItem;
      'shared.metric': SharedMetric;
      'shared.pillar': SharedPillar;
      'shared.social-link': SharedSocialLink;
      'shared.stat': SharedStat;
      'shared.tag': SharedTag;
    }
  }
}
