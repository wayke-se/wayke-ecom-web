import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

export const asHtml = (s?: string) =>
  sanitizeHtml(marked.parse(s || '', { async: false }), {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: [...(sanitizeHtml.defaults.allowedAttributes.a || []), 'rel'],
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
    },
    selfClosing: [...sanitizeHtml.defaults.selfClosing, 'img'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer' }, true),
    },
  });
