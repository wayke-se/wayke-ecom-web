import { OrderOptionsResponse } from '@wayke-se/ecom/dist-types/orders/order-options-response';

interface HowToProps {
  order?: OrderOptionsResponse;
}

const HowTo = ({ order }: HowToProps) => `
  <div class="stack stack--3">
    <h2 class="heading heading--4">Så här köper du bilen online</h2>
    <div class="content">
      <p>På Wayke kan du tryggt köpa din nästa bil online. Reservera bilen genom att klicka dig igenom vårt köpflöde med följande steg:</p>
    </div>
  </div>
  <div class="stack stack--3">
    <ol class="timeline">
      <li class="timeline__item">
        <p>Dina kunduppgifter</p>
        <div>Hämtas smidigt med BankID</div>
      </li>
      <li class="timeline__item">
        <p>Välj leveranssätt</p>
        <div>Hemleverans eller hämta hos handlaren.</div>
      </li>
      <li class="timeline__item">
        <p>Har du inbytesbil?</p>
        <div>Få den värderad direkt online.</div>
      </li>
      <li class="timeline__item">
        <p>Välj finansiering</p>
        <div>Betala allt på en gång, delbetala och gör låneansökan direkt online flexibiliteten med att privatleasa.</div>
      </li>
      <li class="timeline__item">
        <p>Vill du teckna en försäkring?</p>
        <div>Försäkra din nya bil direkt i köpflödet.</div>
      </li>
      <li class="timeline__item">
        <p>Sammanställning och orderbekräftelse</p>
      </li>
    </ol>
  </div>
  <div class="stack stack--3">
    <div class="content">
      <p>Efter att ordern är genomförd tar ${
        order?.getContactInformation()?.name
      } kontakt med dig så kommer ni 
      tillsammans fram till detaljer kring betalning och skriver avtal. </p>
    </div>
  </div>
`;

export default HowTo;
