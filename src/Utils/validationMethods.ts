import { regexEmail, regexPersonalNumber, regexPhoneNumberVariant, regexZip } from './regex';

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
};
