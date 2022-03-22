declare module '*.svg';
declare module '*.png';

interface PayexHostedView {
  paymentMenu: (settings: { container: string; culture: string }) => PayexHostedView;
  open: () => void;
}
interface Payex {
  hostedView: PayexHostedView;
}

declare global {
  interface Window {
    payex?: Payex;
  }
}

export {};
