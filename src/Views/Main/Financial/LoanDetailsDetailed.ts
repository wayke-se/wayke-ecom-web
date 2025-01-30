import i18next from '@i18n';
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
        />
        <label class="waykeecom-accordion__header" for="finance-details-accordion" tabindex="0" aria-label="${i18next.t('loanDetails.showDetails')}">
          <div class="waykeecom-accordion__header-title">${i18next.t('loanDetails.details')}</div>
          <div class="waykeecom-accordion__header-icon" aria-hidden="true">
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
                key: i18next.t('loanDetails.repaymentPeriod'),
                value: `${duration} ${i18next.t('loanDetails.months')}`,
              })}

              ${KeyValueListItem({
                key: i18next.t('loanDetails.interest'),
                value: prettyNumber(interest * 100, { postfix: '%', decimals: 2 }),
              })}

              ${KeyValueListItem({
                key: i18next.t('loanDetails.effectiveInterest'),
                value: prettyNumber(effectiveInterest * 100, { postfix: '%', decimals: 2 }),
              })}

              ${
                setupFee !== undefined &&
                KeyValueListItem({
                  key: i18next.t('loanDetails.setupFee'),
                  value: prettyNumber(setupFee, { postfix: 'kr' }),
                })
              }

              ${
                administrationFee !== undefined &&
                KeyValueListItem({
                  key: i18next.t('loanDetails.administrationFee'),
                  value: prettyNumber(administrationFee, { postfix: 'kr' }),
                })
              }
              ${KeyValueListItem({
                key: i18next.t('loanDetails.totalCreditCost'),
                value: prettyNumber(totalCreditCost, { postfix: 'kr' }),
              })}
            </ul>
          </div>
          <div class="waykeecom-stack waykeecom-stack--2">
            <div class="waykeecom-disclaimer-text">
              <div class="waykeecom-content waykeecom-content--inherit-size">
                <p class="waykeecom-content__p">${i18next.t('loanDetails.disclaimerText1')}</p>
                <p class="waykeecom-content__p">${i18next.t('loanDetails.disclaimerText2')}</p>
              </div>
            </div>
          </div>
          ${
            publicUrl
              ? `
                <div class="waykeecom-stack waykeecom-stack--2">
                  <a
                    href="${publicUrl}"
                    title="${i18next.t('loanDetails.moreInfo', { loanOrgName })}"
                    rel="noopener noreferrer"
                    target="_blank"
                    class="waykeecom-link"
                  >
                    ${i18next.t('loanDetails.moreInfo', { loanOrgName })}
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
