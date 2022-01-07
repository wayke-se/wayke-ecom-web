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
    <div class="p--2">
      <ol class="timeline">
        <li class="timeline__item">
          <div class="timeline__stage">
            <div class="timeline__badge"></div>
          </div>
          <div class="timeline__content">
            <div class="timeline__heading">Dina kunduppgifter</div>
            <div class="timeline__description">Hämtas smidigt med BankID [BankID_LOGO]</div>
          </div>
        </li>
        <li class="timeline__item">
          <div class="timeline__stage">
            <div class="timeline__badge"></div>
          </div>
          <div class="timeline__content">
            <div class="timeline__heading">Välj leveranssätt</div>
            <div class="timeline__description">Hemleverans eller hämta hos handlaren.</div>
          </div>
        </li>
        <li class="timeline__item">
          <div class="timeline__stage">
            <div class="timeline__badge"></div>
          </div>
          <div class="timeline__content">
            <div class="timeline__heading">Har du inbytesbil?</div>
            <div class="timeline__description">Få den värderad direkt online.</div>
          </div>
        </li>
        <li class="timeline__item">
          <div class="timeline__stage">
            <div class="timeline__badge"></div>
          </div>
          <div class="timeline__content">
            <div class="timeline__heading">Välj betalsätt</div>
            <div class="timeline__description">Finansieringstillval med låneansökan online [BankID_LOGO] – svar direkt!</div>
          </div>
        </li>
        <li class="timeline__item">
          <div class="timeline__stage">
            <div class="timeline__badge"></div>
          </div>
          <div class="timeline__content">
            <div class="timeline__heading">Vill du teckna en försäkring?</div>
            <div class="timeline__description">Försäkra din nya bil direkt i köpflödet.</div>
          </div>
        </li>
        <li class="timeline__item timeline__item--final">
          <div class="timeline__stage">
            <div class="timeline__badge"></div>
          </div>
            <div class="timeline__content">
            <div class="timeline__heading">Sammanställning och orderbekräftelse</div>
          </div>
        </li>
      </ol>
    </div>
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
