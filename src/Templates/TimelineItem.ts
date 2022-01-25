interface TimelineItemProps {
  heading?: string;
  description?: string;
  final?: boolean;
}

const TimelineItem = ({ heading, description, final }: TimelineItemProps) => `
  <li class="waykeecom-timeline__item${final ? ' timeline__item--final' : ''}">
    <div class="waykeecom-timeline__stage">
      <div class="waykeecom-timeline__badge"></div>
    </div>
    <div class="waykeecom-timeline__content">
      ${heading ? `<div class="waykeecom-timeline__heading">${heading}</div>` : ''}
      ${description ? `<div class="waykeecom-timeline__description">${description}</div>` : ''}
    </div>
  </li>
`;

export default TimelineItem;
