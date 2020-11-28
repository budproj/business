import { MigrationInterface, QueryRunner } from 'typeorm'

export class RenameUserAuthzSubAndImproveSomeTypes1605733368540 implements MigrationInterface {
  name = 'RenameUserAuthzSubAndImproveSomeTypes1605733368540'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "authz_id" TO "authz_sub"`)
    await queryRunner.query(`ALTER TABLE "confidence_report" ALTER COLUMN "comment" DROP NOT NULL`)
    await queryRunner.query(`COMMENT ON COLUMN "confidence_report"."comment" IS NULL`)
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "description"`)
    await queryRunner.query(`ALTER TABLE "key_result" ADD "description" text`)
    await queryRunner.query(`ALTER TABLE "progress_report" ALTER COLUMN "comment" DROP NOT NULL`)
    await queryRunner.query(`COMMENT ON COLUMN "progress_report"."comment" IS NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "progress_report"."comment" IS NULL`)
    await queryRunner.query(`ALTER TABLE "progress_report" ALTER COLUMN "comment" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "description"`)
    await queryRunner.query(`ALTER TABLE "key_result" ADD "description" character varying NOT NULL`)
    await queryRunner.query(`COMMENT ON COLUMN "confidence_report"."comment" IS NULL`)
    await queryRunner.query(`ALTER TABLE "confidence_report" ALTER COLUMN "comment" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "authz_sub" TO "authz_id"`)
  }
}
