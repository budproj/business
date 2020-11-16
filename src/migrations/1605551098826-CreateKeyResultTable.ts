import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateKeyResultTable1605551098826 implements MigrationInterface {
  name = 'CreateKeyResultTable1605551098826'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "key_result" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "goal" numeric NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9064c5abe9ba68432934564d43f" PRIMARY KEY ("id"))`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "key_result"`)
  }
}
