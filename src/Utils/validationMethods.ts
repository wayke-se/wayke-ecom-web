import { MarketCode } from '../@types/MarketCode';
import {
  regexEmail,
  regexNumber,
  regexPersonalNumber,
  regexPhoneNumberVariant,
  regexRegistrationNumberNorway,
  regexRegistrationNumberSweden,
  regexZip,
} from './regex';

export const validationMethods = {
  requiredEmail: (s: string) => {
    return regexEmail.test(s);
  },
  requiredTelephone: (s: string) => {
    return regexPhoneNumberVariant.test(s);
  },
  requiredSsn: (s: string) => {
    return regexPersonalNumber.test(s);
  },
  requiredSsnOver18: (s: string) => {
    if (validationMethods.requiredSsn(s)) {
      const cleaned = s.replace(regexNumber, '');
      const nonLast = cleaned.slice(0, 8);
      const asDate = `${nonLast.slice(0, 4)}-${nonLast.slice(4, 6)}-${nonLast.slice(6, 8)}`;

      const years =
        new Date(new Date().valueOf() - new Date(asDate).valueOf()).getFullYear() - 1970;

      return years > 17;
    }
    return false;
  },
  requiredZip: (s: string) => {
    return regexZip.test(s);
  },
  requiredNumberOrStringNumberInRange: (s: string | number, from: number, to: number) => {
    const number = parseInt(s.toString(), 10);
    if (isNaN(number)) {
      return false;
    }

    return number >= from && number <= to;
  },
  requiredNumber: (s?: string | number | null) =>
    s !== null && s !== undefined && !Number.isNaN(+s),
  requiredNumberGreaterOrEqualThanZero: (s?: string | number | null) => {
    if (s === undefined || s === null) {
      return false;
    }
    const f = parseInt(s.toString(), 10);
    return !Number.isNaN(f) && f >= 0;
  },
  optionalNumberGreaterOrEqualThanZero: (s?: string | number | null) => {
    if (s === undefined || s === null || (typeof s === 'string' && !s)) {
      return true;
    }
    const f = parseInt(s.toString(), 10);
    return !Number.isNaN(f) && f >= 0;
  },
  optionalNumber: (s?: string | number | null) =>
    s === null || s === undefined || !Number.isNaN(+s),
  requiredRegistrationNumber: (s?: string, marketCode?: MarketCode) => {
    if (!s) {
      return false;
    }

    const trimmed = s.replace(' ', '');

    const hasCorrectLength = marketCode === 'SE' ? trimmed.length === 6 : trimmed.length === 7;
    const isRegexMatch =
      marketCode === 'SE'
        ? regexRegistrationNumberSweden.test(trimmed)
        : regexRegistrationNumberNorway.test(trimmed);

    return hasCorrectLength && isRegexMatch;
  },
  requiredMileage: (s?: string) => {
    return validationMethods.requiredNumberOrStringNumberInRange(s || '', 0, 80000);
  },
  optionalString: (s?: string) => {
    return !!s || !s;
  },
  requiredCondition: (s?: string) => {
    return ['VeryGood', 'Good', 'Ok'].includes(s || '');
  },
  requiredAssessmentMaritalStatus: (s?: string) => {
    return ['married', 'single', 'commonLaw'].includes(s || '');
  },
  requiredAssessmentEmplyment: (s?: string) => {
    return [
      'other',
      'retired',
      'fullTimeEmployed',
      'student',
      'temporarilyEmployed',
      'selfEmployed',
    ].includes(s || '');
  },
  requiredHousingType: (s?: string) => {
    return ['singleFamily', 'condominium', 'apartment'].includes(s || '');
  },
  requiredName: (s?: string) => {
    return !!s;
  },
  requiredCity: (s?: string) => {
    return !!s;
  },
  requiredStreet: (s?: string) => {
    return !!s;
  },
  requiredStreet2: (_s?: string) => {
    return true;
  },
};
