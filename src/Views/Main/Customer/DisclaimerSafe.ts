import Disclaimer from '../../../Components/Disclaimer/Disclaimer';

class DisclaimerSafe extends Disclaimer {
  constructor(element: HTMLElement | null) {
    const text = `Dina uppgifter lagras och sparas säkert. Läs mer i vår <a href="#" title="" target="_blank" rel="noopener noreferrer" class="waykeecom-link">personuppgiftspolicy</a>.`;
    super(element, { text });
  }
}

export default DisclaimerSafe;
