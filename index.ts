import fetch from 'node-fetch';
import fs from 'fs';

const subdomain = process.env.KINTONE_SUBDOMAIN;
const username = process.env.KINTONE_USERNAME;
const password = process.env.KINTONE_PASSWORD;

type Apis = {
  [api: string]: {
    link: string
  }
};

type Api = {
  id: string;
  baseUrl: string;
  path: string;
  httpMethod: string;
  schemas: object;
}


(async () => {
  const baseUrl = `https://${subdomain}.cybozu.com/k/v1`;

  const resp = await fetch(`${baseUrl}/apis.json`);
  const apis: Apis = (await resp.json()).apis;

  const fetchSchemasPromises = Object.values(apis).map(async api => {
    const resp = await fetch(`${baseUrl}/${api.link}`);
    return resp.json();
  });

  const schemas = await Promise.all(fetchSchemasPromises);

  console.log('----------------------');
  console.log(schemas);

  fs.writeFileSync('schemas.json', JSON.stringify(schemas));
})();
