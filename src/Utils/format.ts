export const removeSpaces = (value: string | number) => value.toString().replace(/\s/g, '');

interface PrettyNumberSettings {
  postfix?: string | number;
  prefix?: string | number;
}

export const prettyNumber = (value: string | number, settings?: PrettyNumberSettings) =>
  `${settings?.prefix ? `${settings.prefix}` : ''}${removeSpaces(value).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ' '
  )}${settings?.postfix ? ` ${settings.postfix}` : ''}`;
