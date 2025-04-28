import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import Agenda from "./Agenda";
import Prompt from "./PromptIA";

@Entity("mensagensEnviadas")
class Mensagens {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("datetime")
  agendaPara: Date;

  @Column("json")
  payload: {
    telefone: string;
    texto: string;
  };

  @Column({ default: "pendente" })
  status: "pendente" | "enviado" | "falhou";

  @Column({ default: 0 })
  tentativas: number;

  @ManyToOne(() => Agenda, (agendas) => agendas.agendasMensagens, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "idAgenda" })
  agendaId: Agenda;

  @ManyToOne(() => Prompt, (tipo) => tipo.mensagens)
  @JoinColumn({ name: "idTipoMensagem" })
  idTipoMensagem: Prompt;
}

export default Mensagens;
