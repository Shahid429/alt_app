export async function onRequest(context) {
  const { request } = context;

  // Forward requests to your Worker
  const workerBaseUrl = 'https://rough-sun-1675.shahidmir52141.workers.dev';
  const url = new URL(request.url);
  const proxiedUrl = `${workerBaseUrl}${url.pathname}`;

  // Forward the request to your Worker
  return fetch(proxiedUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });
}
