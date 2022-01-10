interface TimelineItemProps {
  heading?: string;
  description?: string;
  final?: boolean;
}

const TimelineItem = ({ heading, description, final }: TimelineItemProps) => `
  <li class="timeline__item${final ? ' timeline__item--final' : ''}">
    <div class="timeline__stage">
      <div class="timeline__badge"></div>
    </div>
    <div class="timeline__content">
      ${heading ? `<div class="timeline__heading">${heading}</div>` : ''}
      ${description ? `<div class="timeline__description">${description}</div>` : ''}
    </div>
  </li>
`;

export default TimelineItem;
