type ValidHttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export const BANK_ID_THUMBPRINT_HEADER = 'x-certificate-thumbprint';

class HttpRequestBuilder {
  private _method: ValidHttpMethod = 'get';
  private _headers: { [key: string]: string } = {};
  private _body: any = null;

  public accept(acceptHeader: string) {
    this._headers.Accept = acceptHeader;
    return this;
  }

  public method(method: ValidHttpMethod) {
    this._method = method;
    return this;
  }

  public authorization(token: string) {
    this._headers.Authorization = `Bearer ${token}`;
    return this;
  }

  public requestForgeryToken(token: string | undefined) {
    if (!token) throw new Error('Missing request forgery token');

    this._headers['x-rf-token'] = token;
    return this;
  }

  public content(body: any, contentType: string | null = 'application/json') {
    switch (contentType) {
      case 'application/json':
        this._body = JSON.stringify(body);
        break;
      default:
        this._body = body;
        break;
    }

    if (contentType) this._headers['Content-Type'] = contentType;

    return this;
  }

  public bankIdThumbprint(thumbprint: string | undefined) {
    if (!thumbprint) throw new Error('Bank id thumbprint can not be falsy');

    this._headers[BANK_ID_THUMBPRINT_HEADER] = thumbprint;
    return this;
  }

  public build(): RequestInit {
    return {
      body: this._body,
      headers: this._headers,
      method: this._method,
    };
  }
}

export default HttpRequestBuilder;
