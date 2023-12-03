import { NilaBindings } from "..";


interface Payload {
  text: string;
  parse_mode?: string;
}

export const sendMessage = async (payload: Payload, chat_id: any, env: NilaBindings) => {
  const res = await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: chat_id,
      parse_mode: 'markdown',
      ...payload,
    })
  })
}