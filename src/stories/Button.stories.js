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

export const Primary = Template.bind({});

Primary.args = {
  label: 'Button',
  className: 'button-primary',
};
