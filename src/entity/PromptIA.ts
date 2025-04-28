import { Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import Mensagens from "./MensagensClientes";

@Entity("promptIA")
class Prompt {
  @PrimaryGeneratedColumn("increment")
  idTipoMensagem: number;

  @OneToMany(() => Mensagens, (mensagem) => mensagem.idTipoMensagem)
  mensagens: Mensagens[];
}

export default Prompt;
