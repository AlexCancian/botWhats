import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateLogs1745862850872 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "logsEnvios",
        columns: [
          {
            name: "id",
            type: "varchar",
            length: "36",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "idMensagem",
            type: "varchar",
            length: "36",
            isNullable: false,
          },
          {
            name: "status",
            type: "enum",
            enum: ["sucesso", "falha"],
            default: "'sucesso'",
          },
          {
            name: "erro",
            type: "text",
            isNullable: true,
          },
          {
            name: "criadoEm",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("logsEnvios");
  }
}
