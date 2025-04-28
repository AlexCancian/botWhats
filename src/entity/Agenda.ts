import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import Mensagens from "./MensagensClientes";

@Entity("agenda")
class Agenda {
  @PrimaryGeneratedColumn("increment")
  idAgenda: number;


  @OneToMany(() => Mensagens, (mensagem) => mensagem.agendaId)
    agendasMensagens: Mensagens[];
}

export default Agenda;
