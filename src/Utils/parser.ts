import sanitizeHtml from 'sanitize-html';
import ShowdownService from 'showdown';

const showdownService = new ShowdownService.Converter({
  openLinksInNewWindow: true,
});

export const asHtml = (s?: string) =>
  sanitizeHtml(showdownService.makeHtml(s || ''), {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
    },
    selfClosing: [...sanitizeHtml.defaults.selfClosing, 'img'],
  });
