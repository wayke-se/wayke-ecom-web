import { bankid } from '@wayke-se/ecom';

export const getBankIdQrCode = (reference: string) => {
  const request = bankid.newQrCodeRequest().withOrderRef(reference).build();

  return bankid.qrcode(request);
};
