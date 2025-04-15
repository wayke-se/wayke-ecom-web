import { MarketCode } from '../@types/MarketCode';

interface LogotypeProps {
  market: MarketCode;
  className?: string;
}

export const getWordmarkLogotype = ({ market, className }: LogotypeProps) => {
  switch (market) {
    case 'SE':
      return `
        <svg ${!!className ? `class="${className}"` : ''} viewBox="0 0 548.95 123.3" preserveAspectRatio="xMinYMid" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <title>Wayke</title>
          <g>
            <path d="M275.16,48.31l-18.69,53.3h-12L219.59,28h15.08l16.84,52.57,18-52.88h12.29l18.08,53L316.68,28h13.64l-24.17,73.65H293.75Z"></path>
            <path d="M348.51,102c-12.8,0-26.41-9.45-26.41-27s13.61-27,26.41-27c5.12,0,12.39,2,16,7.48l.76,1.16V49h12.92v52.29H365.26V93.18l-.77,1.22C361,100,353,102,348.51,102Zm1.92-41.62c-7.37,0-15,5.48-15,14.65a14.67,14.67,0,0,0,15,14.65c7.39,0,14.87-5,14.87-14.65S357.63,60.36,350.42,60.36Z"></path>
            <path d="M408.36,123.3H395.14l9.92-22.93L381.51,49h14.88l15.39,35.53L427.16,49h13.43Z"></path>
            <path d="M456.35,77.54V101.3h-13V25.83h13V70.31l24-21.28h17.25L469.78,73.41,499,101.3H481.34Z"></path>
            <path d="M548.95,75.88v1.45H507.43c.52,8.16,6.5,14.36,15.18,14.36,8.37,0,11.78-4.23,12.71-5.68h13c-.83,5.37-8,16.63-25.72,16.63-16.94,0-28.4-11.77-28.4-27.47,0-16.22,11.36-27.47,27.37-27.47S548.95,58.84,548.95,75.88Zm-41.11-7.64h27.27c-2-6.61-6.82-10.33-13.53-10.33C514.45,57.92,509.49,61.73,507.84,68.24Z"></path>
          </g>
          <g>
            <circle cx="4.25" cy="39.68" r="4.25"></circle>
            <circle cx="25.15" cy="68.03" r="4.96"></circle>
            <circle cx="46.04" cy="96.38" r="6.38"></circle>
            <circle cx="66.93" cy="68.03" r="7.09"></circle>
            <circle cx="87.82" cy="39.68" r="8.5"></circle>
            <circle cx="108.72" cy="68.03" r="10.63"></circle>
            <circle cx="129.61" cy="96.38" r="12.76"></circle>
            <circle cx="150.5" cy="68.03" r="13.47"></circle>
            <circle cx="171.4" cy="39.68" r="14.17"></circle>
            <circle cx="129.61" cy="39.68" r="12.05"></circle>
            <circle cx="66.93" cy="11.34" r="7.09"></circle>
            <circle cx="150.5" cy="11.34" r="11.34"></circle>
            <circle cx="108.72" cy="11.34" r="10.63"></circle>
            <circle cx="46.04" cy="39.68" r="6.38"></circle>
            <circle cx="25.15" cy="11.34" r="4.96"></circle>
          </g>
        </svg>
      `;
    case 'NO':
      return `
        <svg ${!!className ? `class="${className}"` : ''} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 93" preserveAspectRatio="xMinYMid">
          <title>Drive</title>
          <path d="M234.501 0h21.343l7.478 74.395h3.583L295.466 0h21.343l-35.754 92.987h-36.947L234.501 0ZM221.882 18.631 224.504 0h-20.681l-2.609 18.631h20.668ZM198.617 37.12 190.763 93h20.668l7.854-55.88h-20.668ZM185.817 32.543C188.491 13.95 176.482 0 154.464 0h-46.022l-2.597 18.631h45.919c9.334 0 14.54 5.986 13.333 13.95-1.207 7.965-7.867 13.951-17.202 13.951h-25.302l1.298-9.373h-20.668l-7.79 55.867h20.681l3.895-27.888h23.368c3.739 9.554 7.478 18.462 11.477 27.888h22.07l-12.983-31.884a36.086 36.086 0 0 0 14.785-11.381 35.881 35.881 0 0 0 7.091-17.218ZM47.087 0H13.073L5.206 55.893h20.629l5.193-37.3h13.385c16.682 0 27.081 11.959 24.81 27.9A32.546 32.546 0 0 1 58.14 66.55a32.796 32.796 0 0 1-21.595 7.845H2.61L.013 93h34c28.679 0 52.151-20.583 55.89-46.545C93.642 20.493 75.765 0 47.087 0ZM325.975 0l-2.623 18.592h73.987L400 0h-74.025ZM336.101 74.395l2.674-18.592h42.024l2.661-18.606h-62.717L312.888 93h74.039l2.544-18.605h-53.37Z"/>
        </svg>
      `;
  }
};

// Receive symbol logotype based on current market

export const getSymbolLogotype = ({ market, className }: LogotypeProps) => {
  switch (market) {
    case 'SE':
      return `
        <svg ${!!className ? `class="${className}"` : ''} viewBox="0 0 185.57 109.13" preserveAspectRatio="xMinYMid" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <title>Wayke</title>
          <circle cx="4.25" cy="39.68" r="4.25"></circle>
          <circle cx="25.15" cy="68.03" r="4.96"></circle>
          <circle cx="46.04" cy="96.38" r="6.38"></circle>
          <circle cx="66.93" cy="68.03" r="7.09"></circle>
          <circle cx="87.82" cy="39.68" r="8.5"></circle>
          <circle cx="108.72" cy="68.03" r="10.63"></circle>
          <circle cx="129.61" cy="96.38" r="12.76"></circle>
          <circle cx="150.5" cy="68.03" r="13.47"></circle>
          <circle cx="171.4" cy="39.68" r="14.17"></circle>
          <circle cx="129.61" cy="39.68" r="12.05"></circle>
          <circle cx="66.93" cy="11.34" r="7.09"></circle>
          <circle cx="150.5" cy="11.34" r="11.34"></circle>
          <circle cx="108.72" cy="11.34" r="10.63"></circle>
          <circle cx="46.04" cy="39.68" r="6.38"></circle>
          <circle cx="25.15" cy="11.34" r="4.96"></circle>
        </svg>
      `;
    case 'NO':
      return `
        <svg ${!!className ? `class="${className} waykeecom-modal__norway-footer-logo"` : ''} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37 38">
          <title>Drive</title>
          <path d="M19.27 0H5.348L2.126 22.838h8.445l2.126-15.241h5.479c6.83 0 11.086 4.886 10.156 11.4a13.292 13.292 0 0 1-4.537 8.195 13.441 13.441 0 0 1-8.84 3.206H1.063L0 38h13.919c11.74 0 21.349-8.41 22.88-19.018C38.328 8.373 31.01 0 19.27 0Z" />
        </svg>
      `;
  }
};
