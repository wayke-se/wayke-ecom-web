import { Image } from '../../Utils/constants';
import HtmlNode from '../Extension/HtmlNode';

interface PieChartProps {
  percentage: number;
}

class PieChart extends HtmlNode {
  private props: PieChartProps;

  constructor(element: HTMLElement | null | undefined, props: PieChartProps) {
    super(element);
    this.props = props;

    this.render();
  }

  update(props: PieChartProps) {
    this.props = props;
    this.node
      .querySelector(`.waykeecom-pie-chart__chart-data`)
      ?.setAttribute('stroke-dasharray', `calc(${this.props.percentage} * 31.4 / 100) 31.4`);
  }

  render() {
    const { percentage } = this.props;
    this.node.innerHTML = `
      <div class="waykeecom-pie-chart">
        <svg height="20" width="20" viewBox="0 0 20 20" class="waykeecom-pie-chart__chart">
          <circle r="10" cx="10" cy="10" class="waykeecom-pie-chart__chart-data-base" />
          <circle r="5" cx="10" cy="10" fill="transparent"
            stroke-width="10"
            stroke-dasharray="calc(${percentage} * 31.4 / 100) 31.4"
            transform="rotate(-90) translate(-20)"
            class="waykeecom-pie-chart__chart-data waykeecom-pie-chart__chart-data--1"
            id="loan-details-circle"
          />
        </svg>
        <div class="waykeecom-pie-chart__overlay">
          <img src="${Image.illustrations.payment}" alt="Illustration av betalning" class="waykeecom-pie-chart__illustration" />
        </div>
      </div>
    `;
  }
}

export default PieChart;
