import $ from 'jquery'

export const STATUS_CODES = Object.freeze({
  'continue': 100,
  switchingProtocols: 101,
  processing: 102,
  ok: 200,
  created: 201,
  accepted: 202,
  nonAuthoritativeInformation: 203,
  noContent: 204,
  resetContent: 205,
  partialContent: 206,
  multiStatus: 207,
  alreadyReported: 208,
  IMUsed: 226,
  multipleChoices: 300,
  movedPermanently: 301,
  found: 302,
  seeOther: 303,
  notModified: 304,
  useProxy: 305,
  temporaryRedirect: 307,
  permanentRedirect: 308,
  badRequest: 400,
  unauthorized: 401,
  paymentRequired: 402,
  forbidden: 403,
  notFound: 404,
  methodNotAllowed: 405,
  notAcceptable: 406,
  proxyAuthenticationRequired: 407,
  requestTimeout: 408,
  conflict: 409,
  gone: 410,
  lengthRequired: 411,
  preconditionFailed: 412,
  payloadTooLarge: 413,
  URITooLong: 414,
  unsupportedMediaType: 415,
  rangeNotSatisfiable: 416,
  expectationFailed: 417,
  misdirectedRequest: 421,
  unprocessableEntity: 422,
  locked: 423,
  failedDependency: 424,
  upgradeRequired: 426,
  preconditionRequired: 428,
  tooManyRequests: 429,
  requestHeaderFieldsTooLarge: 431,
  unavailableForLegalReasons: 451,
  internalServerError: 500,
  notImplemented: 501,
  badGateway: 502,
  serviceUnavailable: 503,
  gatewayTimeout: 504,
  HTTPVersionNotSupported: 505,
  variantAlsoNegotiates: 506,
  insufficientStorage: 507,
  loopDetected: 508,
  notExtended: 510,
  networkAuthenticationRequired: 511,
})

function getCSRFToken() {
  return $('meta[name="csrf-token"]').attr('content')
}

// Convenience method for performing a request with a simplified, more practical
// API compared with jQuery.ajax.
//
// Always passes just the jqXHR object to all callbacks in the returned promise
// for a consistent API, unlike jQuery.ajax's inconsistent one.
export function request(method, url, data, options) {
  const promise = $.Deferred()
  const xhrReq = $.ajax(Object.assign({
    type: method,
    url: url,
    data: data,
    headers: {'X-CSRF-Token': getCSRFToken()},
  }, options || {}))

  xhrReq.done((data, textStatus, xhrResp) => {
    promise.resolve(xhrResp)
  })

  xhrReq.fail((xhrResp, _textStatus, _errorThrown) => {
    promise.reject(xhrResp)
  })

  return promise
}
