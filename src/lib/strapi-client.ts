import { strapi } from '@strapi/client';

const client = strapi({
  baseURL: process.env.STRAPI_URL || 'http://localhost:1337/api', // ← lưu ý có `/api`
  auth: process.env.STRAPI_API_TOKEN, // optional
});

export { client as strapiClient };