import { PaymentType, IDeliveryOption } from '@wayke-se/ecom';
import { OrderOptions, PaymentOption } from '../../@types/OrderOptions';
import { StageTypes } from '../../@types/Stages';
import TimelineItem from '../../Templates/TimelineItem';

const TimelineItemByStage = {
  customer: {
    heading: 'Dina kunduppgifter',
  },
  centralStorage: {
    heading: 'Välj anläggning',
    description: 'Välj vilken anläggning du vill köpa bilen ifrån.',
  },
  delivery: {
    heading: 'Välj leveranssätt',
    description: '',
  },
  tradeIn: {
    heading: 'Har du inbytesbil?',
    description: 'Få den värderad direkt online.',
  },
  financial: {
    heading: 'Ägandeform',
    description: '',
  },
  insurance: {
    heading: 'Vill du teckna en försäkring?',
    description: 'Se förslag på försäkringar som passar din nya bil.',
  },
  accessories: {
    heading: 'Tillbehör',
    description: 'Beställ extra utrustning till din bil.',
  },
};

const getFinancialDescription = (options?: PaymentOption[]) => {
  const paymentTypes = options?.map((x) => x.type) || [];
  const hasCash = paymentTypes.find((x) => x === PaymentType.Cash);
  const hasLease = paymentTypes.find((x) => x === PaymentType.Lease);
  const hasLoan = paymentTypes.find((x) => x === PaymentType.Loan);

  if (hasCash && hasLoan && hasLease) {
    return 'Denna bil kan du köpa kontant, privatleasa eller finansiera med ett billån.';
  } else if (hasCash && hasLease) {
    return 'Denna bil kan du köpa kontant eller privatleasa.';
  } else if (hasCash && hasLoan) {
    return 'Denna bil kan du köpa kontant eller finansiera med ett billån';
  } else if (hasLoan && hasLease) {
    return 'Denna bil kan du privatleasa eller finansiera med ett billån';
  } else if (hasCash) {
    return 'Denna bil kan du köpa kontant.';
  } else if (hasLoan) {
    return 'Denna bil kan du finansiera med ett billån';
  } else if (hasLease) {
    return 'Denna bil kan du privatleasa.';
  }
  return '???';
};

const getDeliveryDescription = (options?: IDeliveryOption[]) => {
  const hasPickup = options?.find((x) => x.type === 'Pickup');
  const hasHomeDelivery = options?.find((x) => x.type === 'Delivery');
  if (hasPickup && hasHomeDelivery) {
    return 'Hemleverans eller hämta hos handlaren.';
  } else if (hasPickup) {
    return 'Hämta hos handlaren.';
  } else if (hasHomeDelivery) {
    return 'Hemleverans.';
  }
  return '???';
};

interface HowToProps {
  readonly stageOrderList?: StageTypes[];
  readonly order?: OrderOptions;
}

const HowTo = ({ order, stageOrderList }: HowToProps) => {
  const timelineItemByStage = TimelineItemByStage;
  timelineItemByStage.financial.description = getFinancialDescription(order?.paymentOptions);
  timelineItemByStage.delivery.description = getDeliveryDescription(order?.deliveryOptions);

  return `
  <div class="waykeecom-stack waykeecom-stack--3">
    <h4 class="waykeecom-heading waykeecom-heading--4">Så här köper du bilen online</h4>
    <div class="waykeecom-content">
      <p class="waykeecom-content__p">På Wayke kan du tryggt köpa din nästa bil online. Reservera bilen genom att klicka dig igenom vårt köpflöde med följande steg:</p>
    </div>
  </div>
  <div class="waykeecom-stack waykeecom-stack--3">
    <div class="waykeecom-p--2">
      <ol class="waykeecom-timeline" aria-label="Tillvägagångssätt">
        ${stageOrderList?.map((stage) => TimelineItem(TimelineItemByStage[stage.name])).join('')}
        ${
          order?.isPaymentRequired
            ? TimelineItem({
                heading: 'Genomför förskottsbetalning!',
                description:
                  'Genomför förskottskottsbetalning på 5% av bilens värde. (Genomför betalning av deposition motsvarande 5% av bilens värde.)',
              })
            : ''
        }
        ${TimelineItem({
          heading: 'Klart!',
          final: true,
        })}
      </ol>
    </div>
  </div>
  <div class="waykeecom-stack waykeecom-stack--3">
    <div class="waykeecom-content">
      <p class="waykeecom-content__p">Efter att ordern är genomförd tar ${
        order?.contactInformation?.name
      } kontakt med dig så kommer ni 
      tillsammans fram till detaljer kring betalning och skriver avtal.</p>
    </div>
  </div>
`;
};

export default HowTo;
