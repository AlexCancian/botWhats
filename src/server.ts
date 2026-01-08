import "dotenv/config";
import connectionWhats from "./dataBase/data";
import { processarMensagens } from "./utils/cron";
import { initWhatsApp } from "./repositories/whats";

async function main() {
  await connectionWhats.initialize();
  await initWhatsApp();

  console.log("Backend WhatsApp iniciado");

  const runJob = async () => {
    try {
      console.log("Buscando mensagens pendentes...");
      await processarMensagens();
    } catch (error) {
      console.error("Erro no processamento de mensagens:", error);
    } finally {
      setTimeout(runJob, 60 * 1000);
    }
  };

  runJob();
}

main();
