import i18next from '@i18n';
import { IDeliveryOption, PaymentType } from '@wayke-se/ecom';
import { OrderOptions, PaymentOption } from '../../@types/OrderOptions';
import { StageTypes } from '../../@types/Stages';
import TimelineItem from '../../Templates/TimelineItem';

const getFinancialDescription = (options?: PaymentOption[]) => {
  const paymentTypes = options?.map((x) => x.type) || [];
  const hasCash = paymentTypes.find((x) => x === PaymentType.Cash);
  const hasLease = paymentTypes.find((x) => x === PaymentType.Lease);
  const hasLoan = paymentTypes.find((x) => x === PaymentType.Loan);

  if (hasCash && hasLoan && hasLease) {
    return i18next.t('howTo.financialDescriptionAll');
  }
  if (hasCash && hasLease) {
    return i18next.t('howTo.financialDescriptionCashLease');
  }
  if (hasCash && hasLoan) {
    return i18next.t('howTo.financialDescriptionCashLoan');
  }
  if (hasLoan && hasLease) {
    return i18next.t('howTo.financialDescriptionLoanLease');
  }
  if (hasCash) {
    return i18next.t('howTo.financialDescriptionCash');
  }
  if (hasLoan) {
    return i18next.t('howTo.financialDescriptionLoan');
  }
  if (hasLease) {
    return i18next.t('howTo.financialDescriptionLease');
  }
  return '???';
};

const getDeliveryDescription = (options?: IDeliveryOption[]) => {
  const hasPickup = options?.find((x) => x.type === 'Pickup');
  const hasHomeDelivery = options?.find((x) => x.type === 'Delivery');
  if (hasPickup && hasHomeDelivery) {
    return i18next.t('howTo.deliveryDescriptionBoth');
  }
  if (hasPickup) {
    return i18next.t('howTo.deliveryDescriptionPickup');
  }
  if (hasHomeDelivery) {
    return i18next.t('howTo.deliveryDescriptionHome');
  }
  return '???';
};

interface HowToProps {
  readonly stageOrderList?: StageTypes[];
  readonly order?: OrderOptions;
}

const HowTo = ({ order, stageOrderList }: HowToProps) => {
  const timelineItemByStage = {
    customer: {
      heading: i18next.t('howTo.customerHeading'),
    },
    centralStorage: {
      heading: i18next.t('howTo.centralStorageHeading'),
      description: i18next.t('howTo.centralStorageDescription'),
    },
    delivery: {
      heading: i18next.t('howTo.deliveryHeading'),
      description: '',
    },
    tradeIn: {
      heading: i18next.t('howTo.tradeInHeading'),
      description: i18next.t('howTo.tradeInDescription'),
    },
    financial: {
      heading: i18next.t('howTo.financialHeading'),
      description: '',
    },
    insurance: {
      heading: i18next.t('howTo.insuranceHeading'),
      description: i18next.t('howTo.insuranceDescription'),
    },
    accessories: {
      heading: i18next.t('howTo.accessoriesHeading'),
      description: i18next.t('howTo.accessoriesDescription'),
    },
  };
  timelineItemByStage.financial.description = getFinancialDescription(order?.paymentOptions);
  timelineItemByStage.delivery.description = getDeliveryDescription(order?.deliveryOptions);

  return `
  <div class="waykeecom-stack waykeecom-stack--3">
    <h4 class="waykeecom-heading waykeecom-heading--4">${i18next.t('howTo.heading')}</h4>
    <div class="waykeecom-content">
      <p class="waykeecom-content__p">${i18next.t('howTo.description')}</p>
    </div>
  </div>
  <div class="waykeecom-stack waykeecom-stack--3">
    <div class="waykeecom-p--2">
      <ol class="waykeecom-timeline" aria-label="${i18next.t('howTo.timelineAriaLabel')}">
        ${stageOrderList?.map((stage) => TimelineItem(timelineItemByStage[stage.name])).join('')}
        ${
          order?.isPaymentRequired
            ? TimelineItem({
                heading: i18next.t('howTo.paymentHeading'),
                description: i18next.t('howTo.paymentDescription'),
              })
            : ''
        }
        ${TimelineItem({
          heading: i18next.t('howTo.finalHeading'),
          final: true,
        })}
      </ol>
    </div>
  </div>
  <div class="waykeecom-stack waykeecom-stack--3">
    <div class="waykeecom-content">
      <p class="waykeecom-content__p">${i18next.t('howTo.finalDescription', {
        contactName: order?.contactInformation?.name,
      })}</p>
    </div>
  </div>
`;
};

export default HowTo;
