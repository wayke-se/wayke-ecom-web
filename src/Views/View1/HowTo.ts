import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';
import TimelineItem from '../../Templates/TimelineItem';

import bankidLogotype from '../../assets/images/bankid/bankid-logo.svg';

interface HowToProps {
  order?: OrderOptionsResponse;
}

const HowTo = ({ order }: HowToProps) => `
  <div class="waykeecom-stack waykeecom-stack--3">
    <h3 class="heading heading--4">Så här köper du bilen online</h3>
    <div class="content">
      <p>På Wayke kan du tryggt köpa din nästa bil online. Reservera bilen genom att klicka dig igenom vårt köpflöde med följande steg:</p>
    </div>
  </div>
  <div class="waykeecom-stack waykeecom-stack--3">
    <div class="p--2">
      <ol class="timeline">
        ${TimelineItem({
          heading: 'Dina kunduppgifter',
          description: `Hämtas smidigt med BankID <img src="${bankidLogotype}" alt="BankID logotyp" class="image image--inline" aria-hidden="true" />`,
        })}
        ${TimelineItem({
          heading: 'Välj leveranssätt',
          description: 'Hemleverans eller hämta hos handlaren.',
        })}
        ${TimelineItem({
          heading: 'Har du inbytesbil?',
          description: 'Få den värderad direkt online.',
        })}
        ${TimelineItem({
          heading: 'Välj betalsätt',
          description: `Finansieringstillval med låneansökan online <img src="${bankidLogotype}" alt="BankID logotyp" class="image image--inline" aria-hidden="true" /> – svar direkt!`,
        })}
        ${TimelineItem({
          heading: 'Vill du teckna en försäkring?',
          description: 'Försäkra din nya bil direkt i köpflödet.',
        })}
        ${TimelineItem({
          heading: 'Sammanställning och orderbekräftelse',
          final: true,
        })}
      </ol>
    </div>
  </div>
  <div class="waykeecom-stack waykeecom-stack--3">
    <div class="content">
      <p>Efter att ordern är genomförd tar ${
        order?.getContactInformation()?.name
      } kontakt med dig så kommer ni 
      tillsammans fram till detaljer kring betalning och skriver avtal. </p>
    </div>
  </div>
`;

export default HowTo;
