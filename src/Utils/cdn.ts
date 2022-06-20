export const toCdnMedia = (url: string, cdn?: string) => {
  if (!cdn) return url;
  const asUrl = new URL(url);
  return `${cdn}${asUrl.pathname}`;
};
