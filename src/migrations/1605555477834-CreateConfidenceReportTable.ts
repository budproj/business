import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateConfidenceReportTable1605555477834 implements MigrationInterface {
  name = 'CreateConfidenceReportTable1605555477834'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "confidence_report" ("id" SERIAL NOT NULL, "valuePrevious" numeric NOT NULL, "valueNew" numeric NOT NULL, "user" character varying NOT NULL, "comment" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e196920f2067001715f1e029804" PRIMARY KEY ("id"))`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "confidence_report"`)
  }
}
