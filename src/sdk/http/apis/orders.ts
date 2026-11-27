import { IConfiguration } from '../../config';
import {
  IOrderCreateRequest,
  IOrderCreateResponseData,
  IOrderOptionsRequest,
  IOrderOptionsResponseData,
} from '../../orders/types';
import * as http from '../index';

const buildOptionsRequest = (): RequestInit =>
  http.builder().method('get').accept('application/json').build();

const buildCreateRequest = (
  request: IOrderCreateRequest,
  config: IConfiguration,
  { requestForgeryToken }: http.IHttpStateContext
): RequestInit => {
  const content = {
    vehicleId: request.id,
    tradeIn: request.tradein,
    insurance: request.insurance
      ? {
          ...request.insurance,
          socialId: request.insurance.personalNumber
            ? request.insurance.personalNumber
            : request.customer.personalNumber,
        }
      : undefined,
    payment: request.payment,
    delivery: request.deliveryType,
    customer: {
      socialId: request.customer.personalNumber,
      email: request.customer.email,
      phone: request.customer.phoneNumber,
      name: request.customer.name,
      address: request.customer.address,
      givenName: request.customer.givenName,
      surname: request.customer.surname,
    },
    accessories: request.accessories,
    urls: request.urls,
    origin: config.getOrigin(),
  };

  return http
    .builder()
    .method('post')
    .accept('application/json')
    .requestForgeryToken(requestForgeryToken)
    .content(content)
    .build();
};

const validateOptionsResponse = (
  response: http.IApiResponse<IOrderOptionsResponseData>
): IOrderOptionsResponseData => {
  if (!response || !response.successful || !response.response) {
    throw new Error('The request did not succeed');
  }

  return response.response;
};

const validateCreateResponse = (
  response: http.IApiResponse<IOrderCreateResponseData>
): IOrderCreateResponseData => {
  if (!response || !response.successful || !response.response) {
    throw new Error('The request did not succeed');
  }

  return response.response;
};

const getInitUrl = ({ id, branchId }: IOrderOptionsRequest): string => {
  const url = `/v3/orders/new?vehicleId=${id}`;

  if (!branchId) return url;

  return `${url}&branchId=${branchId}`;
};

export const init = (
  request: IOrderOptionsRequest,
  config: IConfiguration
): Promise<IOrderOptionsResponseData> =>
  http
    .captureStateContext(
      http.json<IOrderOptionsResponseData>(
        `${config.getApiAddress()}${getInitUrl(request)}`,
        buildOptionsRequest()
      )
    )
    .then(validateOptionsResponse);

const getCreateUrl = () => '/v3/orders';

export const create = (
  request: IOrderCreateRequest,
  config: IConfiguration
): Promise<IOrderCreateResponseData> =>
  http
    .captureStateContext(
      http.json<IOrderCreateResponseData>(
        `${config.getApiAddress()}${getCreateUrl()}`,
        buildCreateRequest(request, config, http.context())
      )
    )
    .then(validateCreateResponse);
