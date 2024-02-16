export interface KeyValueListItemImage {
  src: string;
  srcSet?: string;
  alt: string;
}
export interface KeyValueListItemProps {
  key: string | number;
  value: string | number;
  image?: KeyValueListItemImage;
}

const KeyValueListItem = ({ key, value, image }: KeyValueListItemProps) => `
  <li class="waykeecom-key-value-list__item">
    ${
      image
        ? `<div class="waykeecom-key-value-list__key">
            <img src="${image.src}" ${image.srcSet ? `srcSet="${image.srcSet}"` : ''} alt="${
              image.alt
            }" class="waykeecom-key-value-list__key-image" />
            <div class="waykeecom-key-value-list__key-label">${key}</div>
          </div>`
        : `<div class="waykeecom-key-value-list__key">${key}</div>`
    }
    <div class="waykeecom-key-value-list__value">${value}</div>
  </li>
`;

export default KeyValueListItem;
