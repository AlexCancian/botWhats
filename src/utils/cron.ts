import {
  buscarMensagensPendentes,
  marcarMensagemFalha,
  marcarMensagemSucesso,
  registrarLogEnvio,
} from "../repositories/mensagemService";
import { enviarWhatsApp } from "../repositories/whats";

export async function processarMensagens() {
  const mensagens = await buscarMensagensPendentes();

  for (const mensagem of mensagens) {
    const { id, payload, tentativas } = mensagem;

    const enviado = await enviarWhatsApp(payload.telefone, payload.texto);

    if (enviado) {
      await marcarMensagemSucesso(String(id));
      await registrarLogEnvio(String(id), "sucesso");
    } else {
      await marcarMensagemFalha(String(id), Number(tentativas));
      await registrarLogEnvio(String(id), "falha", "Erro ao enviar");
    }
  }
}
