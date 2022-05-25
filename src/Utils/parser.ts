import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

export const asHtml = (s?: string) =>
  sanitizeHtml(marked(s || ''), {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
    },
    selfClosing: [...sanitizeHtml.defaults.selfClosing, 'img'],
  });
