import "dotenv/config";
import connectionWhats from "./dataBase/data";
import { processarMensagens } from "./utils/cron";
import { initWhatsApp } from "./repositories/whats";

async function main() {
  await connectionWhats.initialize();
  await initWhatsApp();

  console.log("Backend WhatsApp iniciado");

  setInterval(async () => {
    console.log("Buscando mensagens pendentes...");
    await processarMensagens();
  }, 60 * 1000);
}

main();
