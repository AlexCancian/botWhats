import { create, Whatsapp } from "venom-bot";
import { setTimeout as wait } from "node:timers/promises";

let client: Whatsapp;

const initWhatsApp = async () => {
  client = await create(
    process.env.SESSION_NAME || "session-default", // sessionName
    undefined, // catchQR (não vamos usar)
    undefined, // statusFind (não vamos usar)
    {
      headless: "new",
      folderNameToken: "./tokens/whatsapp-bot",
      browserArgs: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--headless=new",
      ],
    }
  );
};

const enviarWhatsApp = async (numero: string, mensagem: string) => {
  try {
    await client.sendText(`${numero}@c.us`, mensagem);
    console.log(`✅ Mensagem enviada para ${numero}`);
    await wait(5000);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao enviar para ${numero}:`, error);
    return false;
  }
};

export { initWhatsApp, enviarWhatsApp };
