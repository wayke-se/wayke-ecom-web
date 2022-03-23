import { PaymentType } from '@wayke-se/ecom';
import { OrderOptions, PaymentOption } from '../../@types/OrderOptions';
import { StageTypes } from '../../@types/Stages';
import TimelineItem from '../../Templates/TimelineItem';
import { Image } from '../../Utils/constants';

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
    description: 'Hemleverans eller hämta hos handlaren.',
  },
  tradeIn: {
    heading: 'Har du inbytesbil?',
    description: 'Få den värderad direkt online.',
  },
  financial: {
    heading: 'Ägandeform',
    description: `<span class="waykeecom-text waykeecom-text--valign-middle">Betala allt på en gång, delbetala och gör låneansökan direkt online </span><img src="${Image.bankid}" alt="BankID logotyp" class="waykeecom-image waykeecom-image--inline" aria-hidden="true" /><span class="waykeecom-text waykeecom-text--valign-middle"> eller upplev flexibiliteten med privatleasing.</span>`,
  },
  insurance: {
    heading: 'Vill du teckna en försäkring?',
    description: 'Se förslag på försäkringar som passar din nya bil direkt i köpflödet.',
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
    return 'Kontant, billån eller privatleasing';
  } else if (hasCash && hasLease) {
    return 'Kontant eller privatleasing';
  } else if (hasCash && hasLoan) {
    return 'Kontant eller billån';
  } else if (hasLoan && hasLease) {
    return 'Billån eller privatleasing';
  } else if (hasCash) {
    return 'Kontant';
  } else if (hasLoan) {
    return 'Billån';
  } else if (hasLease) {
    return 'privatleasing';
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
