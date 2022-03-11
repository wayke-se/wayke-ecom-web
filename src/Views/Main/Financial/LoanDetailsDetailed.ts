import HtmlNode from '../../../Components/Extension/HtmlNode';
import KeyValueListItem from '../../../Templates/KeyValueListItem';
import { prettyNumber } from '../../../Utils/format';

let persistedShowDetails = false;

interface LoanDetailsDetailedProps {
  duration: number;
  administrationFee?: number;
  setupFee?: number;
  totalCreditCost: number;
  interest: number;
  effectiveInterest: number;
  publicUrl?: string;
  loanOrgName?: string;
}

class LoanDetailsDetailed extends HtmlNode {
  private props: LoanDetailsDetailedProps;
  private showDetails = persistedShowDetails;

  constructor(element: HTMLElement | null | undefined, props: LoanDetailsDetailedProps) {
    super(element);
    this.props = props;

    this.render();
  }

  private onDetails(e: Event) {
    const value = (e.currentTarget as HTMLInputElement).checked;
    persistedShowDetails = value;
    this.showDetails = value;
  }

  update(props: LoanDetailsDetailedProps) {
    this.props = props;
    this.render();
  }

  render() {
    const {
      duration,
      administrationFee,
      setupFee,
      totalCreditCost,
      interest,
      effectiveInterest,
      publicUrl,
      loanOrgName,
    } = this.props;
    this.node.innerHTML = `
      <div class="waykeecom-accordion">
        <input
          type="checkbox"
          id="finance-details-accordion"
          class="waykeecom-accordion__checkbox"
          ${this.showDetails ? `checked="true"` : ''}
          tabindex="-1"
        />
        <label class="waykeecom-accordion__header" for="finance-details-accordion" tabindex="0" aria-label="Visa detaljer">
          <div class="waykeecom-accordion__header-title">Detaljer</div>
          <div class="waykeecom-accordion__header-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              class="waykeecom-icon"
              data-icon="Chevron down"
            >
              <path d="M6.7 11.4 0 4.6l1.3-1.4L8 10.1l6.7-6.9L16 4.6l-6.7 6.9L8 12.8l-1.3-1.4z" />
            </svg>
          </div>
        </label>
        <div class="waykeecom-accordion__body">
          <div class="waykeecom-stack waykeecom-stack--2">
            <ul class="waykeecom-key-value-list">
              ${KeyValueListItem({
                key: 'Avbetalningsperoid',
                value: `${duration} mån`,
              })}

              ${KeyValueListItem({ key: 'Ränta', value: `${interest * 100}%**` })}

              ${KeyValueListItem({
                key: 'Effektiv ränta',
                value: `${effectiveInterest * 100}%**`,
              })}

              ${
                setupFee !== undefined &&
                KeyValueListItem({
                  key: 'Uppläggningskostnad',
                  value: prettyNumber(setupFee, { postfix: 'kr' }),
                })
              }

              ${
                administrationFee !== undefined &&
                KeyValueListItem({
                  key: 'Administrativa kostnader',
                  value: prettyNumber(administrationFee, { postfix: 'kr' }),
                })
              }
              ${KeyValueListItem({
                key: 'Total kreditkostnad',
                value: prettyNumber(totalCreditCost, { postfix: 'kr' }),
              })}
            </ul>
          </div>
          <div class="waykeecom-stack waykeecom-stack--2">
            <div class="waykeecom-disclaimer-text">
              <p>**Det här är inte den slutgiltiga offerten. Räntan kan komma att ändras ifall det sker justeringar i initial amorteringsplan, tillägg i utrustning eller andra ändringar som påverkar det initiala prisförslaget.</p>
              <p>Om marknadsräntan förändras kan månadskostnaden komma att ändras i motsvarande mån. Månadskostnaden kan också komma att påverkas utifrån den kreditriskbedömning som görs efter en kreditupplysning.</p>
            </div>
          </div>
          ${
            publicUrl
              ? `
                <div class="waykeecom-stack waykeecom-stack--2">
                  <a
                    href="${publicUrl}"
                    title="Visa mer information om ${loanOrgName}"
                    rel="noopener noreferrer"
                    target="_blank"
                    class="waykeecom-link"
                  >
                    Mer information om ${loanOrgName}
                  </a>
                </div>
              `
              : ''
          }
        </div>
      </div>
    </div>
    `;

    this.node.querySelector(`input`)?.addEventListener('click', (e) => this.onDetails(e));
  }
}

export default LoanDetailsDetailed;
