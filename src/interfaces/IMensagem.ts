import Agenda from "../entity/Agenda";
import Prompt from "../entity/PromptIA";

interface IMensagens {
  id?: string;
  agendaPara: Date;
  payload: {
    telefone: string;
    texto: string;
  };
  status?: "pendente" | "enviado" | "falhou";
  tentativas?: number;
  agendaId: Agenda;
  idTipoMensagem: Prompt;
}

export default IMensagens;