import { MarketCode } from '../@types/MarketCode';

export const getLanguage = (marketCode?: MarketCode) => {
  switch (marketCode) {
    case 'NO':
      return 'nb-NO';
    case 'SE':
      return 'sv-SE';
    default:
      return 'en-US';
  }
};
