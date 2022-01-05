import { regexEmail, regexPhoneNumberVariant } from './regex';

export const validationMethods = {
  requiredEmail: (s: string) => {
    return regexEmail.test(s);
  },
  requiredTelephone: (s: string) => {
    return regexPhoneNumberVariant.test(s);
  },
};
