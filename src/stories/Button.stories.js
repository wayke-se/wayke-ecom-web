export default {
  title: 'Components/Component/Button',
  argTypes: {
    label: { control: 'text' },
    className: { control: 'text' },
  },
};

const Template = ({ label, className }) => {
  return `<button class="${className}">${label}</button>`;
};

export const Default = Template.bind({});
Default.args = {
  label: 'Button',
  className: 'waykeecom-button',
};

export const Primary = Template.bind({});
Primary.args = {
  label: 'Button',
  className: 'waykeecom-button waykeecom-button--primary',
};

export const Action = Template.bind({});
Action.args = {
  label: 'Button',
  className: 'waykeecom-button waykeecom-button--action',
};

export const ActionAlt = Template.bind({});
ActionAlt.args = {
  label: 'Button',
  className: 'waykeecom-button waykeecom-button--action-alt',
};

export const ActionClear = Template.bind({});
ActionClear.args = {
  label: 'Button',
  className: 'waykeecom-button waykeecom-button--action-clear',
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  label: 'Button',
  className: 'waykeecom-button waykeecom-button--primary  waykeecom-button--full-width',
};

export const SizeSmall = Template.bind({});
SizeSmall.args = {
  label: 'Button',
  className: 'waykeecom-button waykeecom-button--primary  waykeecom-button--size-small',
};
