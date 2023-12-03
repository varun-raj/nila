import { Hono } from 'hono'
import { Ai } from '@cloudflare/ai'
import { nanoid } from 'nanoid'
import { sendMessage } from './telegram/sendMessage';
import { sendPhoto } from './telegram/sendPhoto';

export type NilaBindings = {
  AI: any;
  NILA_BUCKET: any;
  TG_BOT_TOKEN: string;
  ASSET_BASE_URL: string;
}

const app = new Hono<{ Bindings: NilaBindings }>()

app.get('/', (c) => c.text('Hello Hono!'))

app.post('/nila-message', async (c) => {
  const ai = new Ai(c.env?.AI);

  const { message } = await c.req.json() as { message: { text: string, chat: { id: string } } }

  if (message.text.startsWith('/image')) {
    const prompt = message.text.replace('/image', '')
    await sendMessage({ text: `Generating an image for:\n\n*${prompt}*` }, message.chat.id, c.env)

    const response = await ai.run("@cf/stabilityai/stable-diffusion-xl-base-1.0", { prompt });
    const fileName = "sdImages/" + nanoid() + ".png"
    await c.env.NILA_BUCKET?.put(fileName, response);

    const payload = {
      caption: "Generated Image:",
      photo: c.env.ASSET_BASE_URL + fileName,
      parse_mode: 'markdown'
    }
    await sendPhoto(payload, message.chat.id, c.env)

  } else if (message.text.startsWith('/info')) {
    await sendMessage({ text: `ENV Info:\n\nASSET_URL:*${c.env.ASSET_BASE_URL}*` }, message.chat.id, c.env)
  } else {
    const response = await ai.run('@cf/meta/llama-2-7b-chat-fp16', {
      prompt: message.text
    });
    await sendMessage({ text: response.response }, message.chat.id, c.env)
  }
  return c.text('Hello Hono!')
})

export default app
