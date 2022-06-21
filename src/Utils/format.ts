import { Vehicle } from '../@types/Vehicle';

export const removeSpaces = (value: string | number) => value.toString().replace(/\s/g, '');

interface PrettyNumberSettings {
  postfix?: string | number;
  prefix?: string | number;
  decimals?: number;
}

const formatDecimals = (value: number, decimals: number) => {
  if (!decimals) return value;
  const upper = Math.pow(10, decimals);
  return (Math.round(value * upper) / upper).toFixed(decimals);
};

export const prettyNumber = (value: number | undefined, settings?: PrettyNumberSettings) => {
  if (value === undefined) return '???';
  const formattedValue = formatDecimals(
    value,
    settings?.decimals !== undefined ? settings.decimals : 0
  );
  return `${settings?.prefix ? `${settings.prefix}` : ''}${removeSpaces(formattedValue).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ' '
  )}${settings?.postfix ? ` ${settings.postfix}` : ''}`;
};

const removeParts = (orginal: string, remove: string) => {
  const orginalSplitt = orginal.split(' ');
  const removeSplitted = remove.split(' ').map((x) => x.toLowerCase());
  return orginalSplitt.filter((x) => !removeSplitted.includes(x.toLowerCase())).join(' ');
};

export const formatShortDescription = (vehicle?: Vehicle) => {
  if (!vehicle) return undefined;
  return removeParts(vehicle.shortDescription || '', vehicle.title || '');
};
