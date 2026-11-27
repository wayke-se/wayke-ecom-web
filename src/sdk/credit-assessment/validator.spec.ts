import * as fixtures from '../../test/fixtures';
const fixture = (name: string, withValues: any = undefined): any =>
  fixtures.create(name, withValues);

import {
  HousingType,
  ICreditAssessmentCustomer,
  ICreditAssessmentHouseholdEconomy,
  ICreditAssessmentInquiry,
  ICreditAssessmentLoan,
} from './types';
import {
  validateCustomer,
  validateHouseholdEconomy,
  validateInquiry,
  validateLoan,
} from './validator';

describe('Validate credit assessment inquiry', () => {
  describe('Given complete inquiry', () => {
    it('Should not throw', () => {
      const inquiry = fixture('ICreditAssessmentInquiry', (data: ICreditAssessmentInquiry) => {
        data.householdEconomy.housingType = HousingType.Condominium;
        return data;
      });

      expect(() => validateInquiry(inquiry)).not.toThrowError();
    });
  });

  describe('Given null inquiry', () => {
    it('Should throw', () => {
      expect(() => validateInquiry(null as any)).toThrowError();
    });
  });

  describe('Given null external id', () => {
    it('Should throw', () => {
      const inquiry = fixture('ICreditAssessmentInquiry', (data: ICreditAssessmentInquiry) => {
        data.externalId = null as any;
        return data;
      });
      expect(() => validateInquiry(inquiry)).toThrowError();
    });
  });
});

describe('Validate customer for credit assessment', () => {
  describe('Given complete customer', () => {
    it('Should not throw', () => {
      const customer = fixture('ICreditAssessmentCustomer');
      expect(() => validateCustomer(customer)).not.toThrowError();
    });
  });

  describe('Given null customer', () => {
    it('Should throw', () => {
      expect(() => validateCustomer(null as any)).toThrowError();
    });
  });

  describe('Given null social id', () => {
    it('Should throw', () => {
      const customer = fixture('ICreditAssessmentCustomer', (data: ICreditAssessmentCustomer) => {
        data.socialId = null as any;
        return data;
      });
      expect(() => validateCustomer(customer)).toThrowError();
    });
  });

  describe('Given null signer ip', () => {
    it('Should not throw', () => {
      const customer = fixture('ICreditAssessmentCustomer', (data: ICreditAssessmentCustomer) => {
        data.signerIp = null as any;
        return data;
      });
      expect(() => validateCustomer(customer)).not.toThrowError();
    });
  });
});

describe('Validate loan for credit assessment', () => {
  describe('Given complete loan', () => {
    it('Should not throw', () => {
      const loan = fixture('ICreditAssessmentLoan');
      expect(() => validateLoan(loan)).not.toThrowError();
    });
  });

  describe('Given null loan', () => {
    it('Should throw', () => {
      expect(() => validateLoan(null as any)).toThrowError();
    });
  });

  describe('Given null down payment', () => {
    it('Should throw', () => {
      const loan = fixture('ICreditAssessmentLoan', (data: ICreditAssessmentLoan) => {
        data.downPayment = null as any;
        return data;
      });
      expect(() => validateLoan(loan)).toThrowError();
    });
  });

  describe('Given no down payment', () => {
    it('Should not throw', () => {
      const loan = fixture('ICreditAssessmentLoan', (data: ICreditAssessmentLoan) => {
        data.downPayment = 0;
        return data;
      });
      expect(() => validateLoan(loan)).not.toThrowError();
    });
  });
});

describe('Validate household economy for credit assessment', () => {
  describe('Given complete household economy', () => {
    it('Should not throw', () => {
      const householdEconomy = fixture(
        'ICreditAssessmentHouseholdEconomy',
        (data: ICreditAssessmentHouseholdEconomy) => {
          data.housingType = HousingType.Condominium;
          return data;
        }
      );
      expect(() => validateHouseholdEconomy(householdEconomy)).not.toThrowError();
    });
  });

  describe('Given null household economy', () => {
    it('Should throw', () => {
      expect(() => validateHouseholdEconomy(null as any)).toThrowError();
    });
  });

  describe('Given undefined marital status', () => {
    it('Should throw', () => {
      const householdEconomy = fixture(
        'ICreditAssessmentHouseholdEconomy',
        (data: ICreditAssessmentHouseholdEconomy) => {
          data.maritalStatus = null as any;
          return data;
        }
      );
      expect(() => validateHouseholdEconomy(householdEconomy)).toThrowError();
    });
  });

  describe('Given null income', () => {
    it('Should throw', () => {
      const householdEconomy = fixture(
        'ICreditAssessmentHouseholdEconomy',
        (data: ICreditAssessmentHouseholdEconomy) => {
          data.income = null as any;
          return data;
        }
      );
      expect(() => validateHouseholdEconomy(householdEconomy)).toThrowError();
    });
  });

  describe('Given no income', () => {
    it('Should not throw', () => {
      const householdEconomy = fixture(
        'ICreditAssessmentHouseholdEconomy',
        (data: ICreditAssessmentHouseholdEconomy) => {
          data.income = 0;
          data.housingType = HousingType.Condominium;
          return data;
        }
      );

      expect(() => validateHouseholdEconomy(householdEconomy)).not.toThrowError();
    });
  });
});
