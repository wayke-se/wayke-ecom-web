import * as http from '../../index';
import Configuration from '../../../config/index';

export const createRequest = (): RequestInit => {
  const requestForgeryToken = http.context().requestForgeryToken;
  const builder = http
    .builder()
    .method('post')
    .accept('application/json')
    .requestForgeryToken(requestForgeryToken);

  if (Configuration.current().useBankIdThumbprint()) {
    const thumbprint = Configuration.current().getBankIdThumbprint();
    builder.bankIdThumbprint(thumbprint);
  }

  const request = builder.build();
  return request;
};
