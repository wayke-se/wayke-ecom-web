import {
  regexEmail,
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
  requiredNumber: (s: string | number) => {
    const number = parseInt(s.toString(), 10);
    return !isNaN(number);
  },
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
};
