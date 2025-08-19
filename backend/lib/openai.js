import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
export default client;
