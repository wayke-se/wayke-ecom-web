import { regexEmail, regexPhoneNumberVariant } from './regex';
export const validationMethods = {
    requiredEmail: (s) => {
        return regexEmail.test(s);
    },
    requiredTelephone: (s) => {
        return regexPhoneNumberVariant.test(s);
    },
};
