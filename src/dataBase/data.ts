import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import Mensagens from "../entity/MensagensClientes";
import Agenda from "../entity/Agenda";
import Prompt from "../entity/PromptIA";
import LogEnvio from "../entity/Logs";

dotenv.config();

const isCompiled = __filename.endsWith(".js");
const migrationsPath = isCompiled ? "build/migration/*.js" : "src/migration/*.ts";

const connectionWhats = new DataSource({
  type: "mysql",
  host: process.env.DB_HOSTNAME,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  extra: { decimalNumbers: true },
  logging: false,
  entities: [Agenda, Prompt, Mensagens, LogEnvio],
  migrations: [migrationsPath],
  subscribers: [],
  timezone: "Z",
});

export default connectionWhats;
