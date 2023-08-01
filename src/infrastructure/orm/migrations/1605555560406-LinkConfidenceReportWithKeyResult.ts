import { MigrationInterface, QueryRunner } from 'typeorm'

export class LinkConfidenceReportWithKeyResult1605555560406 implements MigrationInterface {
  name = 'LinkConfidenceReportWithKeyResult1605555560406'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "confidence_report" ADD "keyResultId" integer`)
    await queryRunner.query(
      `ALTER TABLE "confidence_report" ADD CONSTRAINT "FK_77abd95d6700ac3b4bb291fd0da" FOREIGN KEY ("keyResultId") REFERENCES "key_result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "confidence_report" DROP CONSTRAINT "FK_77abd95d6700ac3b4bb291fd0da"`,
    )
    await queryRunner.query(`ALTER TABLE "confidence_report" DROP COLUMN "keyResultId"`)
  }
}
