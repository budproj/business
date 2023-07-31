import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemovesProgressReportUniqueConstraint1608765362618 implements MigrationInterface {
  name = 'RemovesProgressReportUniqueConstraint1608765362618'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "progress_report" DROP CONSTRAINT "UQ_f36324cc2bdcc2bb1b22f421e98"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "progress_report" ADD CONSTRAINT "UQ_f36324cc2bdcc2bb1b22f421e98" UNIQUE ("key_result_id", "value_previous", "value_new")`,
    )
  }
}
