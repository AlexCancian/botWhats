import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  WASocket,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import { sendDisconnectEmail, sendPairingCodeEmail } from "../utils/emailService";

import pino from "pino";

let client: WASocket;

const initWhatsApp = async () => {
  const sessionName = process.env.SESSION_NAME || "session";
  const { state, saveCreds } = await useMultiFileAuthState(sessionName);
  const { version, isLatest } = await fetchLatestBaileysVersion();
  
  console.log(`Usando Baileys v${version.join(".")}, isLatest: ${isLatest}`);

  client = makeWASocket({
    version,
    logger: pino({ level: "silent" }) as any,
    printQRInTerminal: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }) as any),
    },
  });

  // Lógica de Pareamento via Código (Pairing Code)
  if (!client.authState.creds.registered) {
      const phoneNumber = process.env.WHATSAPP_PHONE_NUMBER?.replace(/\D/g, "") || "5511999999999";
      
      if (phoneNumber === "5511999999999") {
          console.warn("\n⚠️ AVISO: Usando número de exemplo. Defina 'WHATSAPP_PHONE_NUMBER' no .env para o seu número real!\n");
      }

      console.log(`\nSolicitando código de pareamento para: ${phoneNumber}...`);
      setTimeout(async () => {
          try {
             const code = await client.requestPairingCode(phoneNumber);
             console.log(`\n--- CÓDIGO DE PAREAMENTO: ${code} ---\n`);
             await sendPairingCodeEmail(code);
          } catch (err) {
             console.error("Erro ao solicitar código de pareamento:", err);
          }
      }, 4000);
  }

  client.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
       console.log("QR Code recebido, mas ignorado. Usando Pairing Code.");
    }

    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
        
      const reason = (lastDisconnect?.error as Boom)?.message || "Desconhecido";
      console.log(
        "Conexão fechada devido a ",
        reason,
        ", reconectando ",
        shouldReconnect
      );

      if (shouldReconnect) {
        initWhatsApp();
      } else {
          console.log("Conexão encerrada. Delete a pasta do token e reinicie.");
          sendDisconnectEmail(reason);
      }
    } else if (connection === "open") {
      console.log("✅ Conexão aberta com sucesso!");
    }
  });

  client.ev.on("creds.update", saveCreds);
};

const enviarWhatsApp = async (numero: string, mensagem: string): Promise<boolean> => {
  try {
    if (!client) {
        console.error("Client WhatsApp não está inicializado.");
        return false;
    }

    // Remove qualquer coisa que não seja dígito
    let cleanNumber = numero.replace(/\D/g, ""); 

    // Tratamento básico para adicionar DDI 55 se parecer um número BR sem DDI
    // Números BR móveis com DDD tem 11 dígitos (11 91234 5678)
    // Números BR fixos com DDD tem 10 dígitos (11 3123 4567)
    if (cleanNumber.length === 10 || cleanNumber.length === 11) {
      cleanNumber = "55" + cleanNumber;
    }

    const id = `${cleanNumber}@s.whatsapp.net`;
    
    // Verifica se o cliente está conectado
    if (!client.user) { // client.user é preenchido quando a conexão conecta
         console.warn("WhatsApp ainda conectando... aguardando 5s");
         await new Promise(r => setTimeout(r, 5000));
    }

    // Verifica se o número existe no whats
    console.log(`Verificando existência do número: ${id}`);
    const results = await client.onWhatsApp(id);
    const result = results?.[0];
    
    if (!result || !result.exists) { 
        console.error(`❌ Número não registrado no WhatsApp: ${id} (Original: ${numero})`); 
        return false; 
    }

    // Usa o JID retornado pela validação para garantir o formato correto (ex: 55119... vs 55119...:18@...)
    const finalId = result.jid;

    await client.sendMessage(finalId, { text: mensagem });
    console.log(`✅ Mensagem (realmente) enviada para ${finalId}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao enviar para ${numero}:`, error);
    return false;
  }
};

export { initWhatsApp, enviarWhatsApp };
