import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import { StageTypes } from '../../@types/Stages';
import TimelineItem from '../../Templates/TimelineItem';
import { Image } from '../../Utils/constants';

const TimelineItemByStage = {
  customer: {
    heading: 'Dina kunduppgifter',
    description: `Hämtas smidigt med BankID <img src="${Image.bankid}" alt="BankID logotyp" class="waykeecom-image waykeecom-image--inline" aria-hidden="true" />`,
  },
  centralStorage: {
    heading: 'Välj anläggning',
    description: 'Välj vilken anläggnign',
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
    heading: 'Välj finansiering',
    description:
      'Betala allt på en gång, delbetala och gör låneansökan direkt online eller upplev flexibiliteten med att privatleasa.',
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

interface HowToProps {
  stageOrderList?: StageTypes[];
  order?: OrderOptionsResponse;
}

const HowTo = ({ order, stageOrderList }: HowToProps) => `
  <div class="waykeecom-stack waykeecom-stack--3">
    <h4 class="waykeecom-heading waykeecom-heading--4">Så här köper du bilen online</h4>
    <div class="waykeecom-content">
      <p>På Wayke kan du tryggt köpa din nästa bil online. Reservera bilen genom att klicka dig igenom vårt köpflöde med följande steg:</p>
    </div>
  </div>
  <div class="waykeecom-stack waykeecom-stack--3">
    <div class="waykeecom-p--2">
      <ol class="waykeecom-timeline" aria-label="Tillvägagångssätt">
        ${stageOrderList?.map((stage) => TimelineItem(TimelineItemByStage[stage.name])).join('')}
        ${TimelineItem({
          heading: 'Sammanställning och orderbekräftelse',
          final: true,
        })}
      </ol>
    </div>
  </div>
  <div class="waykeecom-stack waykeecom-stack--3">
    <div class="waykeecom-content">
      <p>Efter att ordern är genomförd tar ${
        order?.getContactInformation()?.name
      } kontakt med dig så kommer ni 
      tillsammans fram till detaljer kring betalning och skriver avtal. </p>
    </div>
  </div>
`;

export default HowTo;
