import { MigrationInterface, QueryRunner } from 'typeorm'

export class MovesReportsToRealNumbers1606313491853 implements MigrationInterface {
  name = 'MovesReportsToRealNumbers1606313491853'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "confidence_report" DROP COLUMN "value_previous"`)
    await queryRunner.query(`ALTER TABLE "confidence_report" ADD "value_previous" integer`)
    await queryRunner.query(`ALTER TABLE "confidence_report" DROP COLUMN "value_new"`)
    await queryRunner.query(`ALTER TABLE "confidence_report" ADD "value_new" integer NOT NULL`)
    await queryRunner.query(`ALTER TABLE "progress_report" DROP COLUMN "value_previous"`)
    await queryRunner.query(`ALTER TABLE "progress_report" ADD "value_previous" real`)
    await queryRunner.query(`ALTER TABLE "progress_report" DROP COLUMN "value_new"`)
    await queryRunner.query(`ALTER TABLE "progress_report" ADD "value_new" real NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "progress_report" ADD CONSTRAINT "UQ_f36324cc2bdcc2bb1b22f421e98" UNIQUE ("value_previous", "value_new", "key_result_id")`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "progress_report" DROP CONSTRAINT "UQ_f36324cc2bdcc2bb1b22f421e98"`,
    )
    await queryRunner.query(`ALTER TABLE "progress_report" DROP COLUMN "value_new"`)
    await queryRunner.query(`ALTER TABLE "progress_report" ADD "value_new" numeric NOT NULL`)
    await queryRunner.query(`ALTER TABLE "progress_report" DROP COLUMN "value_previous"`)
    await queryRunner.query(`ALTER TABLE "progress_report" ADD "value_previous" numeric`)
    await queryRunner.query(`ALTER TABLE "confidence_report" DROP COLUMN "value_new"`)
    await queryRunner.query(`ALTER TABLE "confidence_report" ADD "value_new" numeric NOT NULL`)
    await queryRunner.query(`ALTER TABLE "confidence_report" DROP COLUMN "value_previous"`)
    await queryRunner.query(`ALTER TABLE "confidence_report" ADD "value_previous" numeric`)
  }
}
