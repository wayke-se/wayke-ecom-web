export const swedbankPayment = (url: string) => {
  const script = document.createElement('script');
  script.setAttribute('src', url);
  script.onload = function () {
    window.payex?.hostedView
      .paymentMenu({
        container: 'payment-menu',
        culture: 'sv-SE',
      })
      .open();
  };
  const head = document.getElementsByTagName('head')[0];
  head.appendChild(script);
};
