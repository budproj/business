import { MigrationInterface, QueryRunner } from 'typeorm'

export class LinkProgressReportWithKeyResult1605555411813 implements MigrationInterface {
  name = 'LinkProgressReportWithKeyResult1605555411813'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "progress_report" ADD "keyResultId" integer`)
    await queryRunner.query(
      `ALTER TABLE "progress_report" ADD CONSTRAINT "FK_4b99dc1ce620819715fc4624dc6" FOREIGN KEY ("keyResultId") REFERENCES "key_result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "progress_report" DROP CONSTRAINT "FK_4b99dc1ce620819715fc4624dc6"`)
    await queryRunner.query(`ALTER TABLE "progress_report" DROP COLUMN "keyResultId"`)
  }
}
