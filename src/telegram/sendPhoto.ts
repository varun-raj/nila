import { NilaBindings } from "..";

interface Payload {
  caption: string;
  photo: string;
  parse_mode?: string;
}
export const sendPhoto = async (payload: Payload, chat_id: any, env: NilaBindings) => {
  const res = await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendPhoto`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: chat_id,
      ...payload,
    })
  })
}