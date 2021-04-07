import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTeamTable1605549933223 implements MigrationInterface {
  name = 'CreateTeamTable1605549933223'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "team" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "team"`)
  }
}
