import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateProgressReportTable1605555342880 implements MigrationInterface {
  name = 'CreateProgressReportTable1605555342880'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "progress_report" ("id" SERIAL NOT NULL, "valuePrevious" numeric NOT NULL, "valueNew" numeric NOT NULL, "user" character varying NOT NULL, "comment" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_de44d4f311d5a0132f49f9f0820" PRIMARY KEY ("id"))`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "progress_report"`)
  }
}
