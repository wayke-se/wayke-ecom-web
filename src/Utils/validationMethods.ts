import {
  regexEmail,
  regexNumber,
  regexPersonalNumber,
  regexPhoneNumberVariant,
  regexRegistrationNumber,
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
  optionalNumber: (s?: string | number | null) =>
    s === null || s === undefined || !Number.isNaN(+s),
  requiredRegistrationNumber: (s?: string) => {
    if (!s) {
      return false;
    }

    const trimmed = s.replace(' ', '');

    const hasCorrectLength = trimmed.length === 6;
    const isRegexMatch = regexRegistrationNumber.test(trimmed);

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
    return ['married', 'single'].includes(s || '');
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
};
