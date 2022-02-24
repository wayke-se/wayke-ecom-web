export interface KeyValueListItemProps {
  key: string | number;
  value: string | number;
}

const KeyValueListItem = ({ key, value }: KeyValueListItemProps) => `
  <li class="waykeecom-key-value-list__item">
    <div class="waykeecom-key-value-list__key">${key}</div>
    <div class="waykeecom-key-value-list__value">${value}</div>
  </li>
`;

export default KeyValueListItem;
