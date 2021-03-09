import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddsCadenceAttributesToCycle1615296809147 implements MigrationInterface {
  name = 'AddsCadenceAttributesToCycle1615296809147'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "cycle_cadence_enum" AS ENUM('YEARLY', 'QUATERLY')`)
    await queryRunner.query(`ALTER TABLE "cycle" ADD "cadence" "cycle_cadence_enum"`)
    await queryRunner.query(
      `UPDATE "cycle" SET cadence=(CASE WHEN (DATE_PART('month', date_end) - DATE_PART('month', date_start) > 3) then 'YEARLY'::"cycle_cadence_enum" else 'QUATERLY'::"cycle_cadence_enum" END)`,
    )
    await queryRunner.query(`ALTER TABLE "cycle" ALTER COLUMN "cadence" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "cycle" ADD "active" boolean NOT NULL DEFAULT true`)
    await queryRunner.query(`ALTER TABLE "cycle" ADD "fiscal_year" integer`)
    await queryRunner.query(`UPDATE "cycle" SET fiscal_year=(DATE_PART('year', date_start))`)
    await queryRunner.query(`ALTER TABLE "cycle" ALTER COLUMN "fiscal_year" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "cycle" ADD "quarter" integer`)
    await queryRunner.query(
      `UPDATE "cycle" set quarter=(CASE WHEN cadence='YEARLY' THEN null ELSE DATE_PART('quarter', date_start) END)`,
    )
    await queryRunner.query(`ALTER TABLE "cycle" ALTER COLUMN "name" SET NOT NULL`)
    await queryRunner.query(`COMMENT ON COLUMN "cycle"."name" IS NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "cycle"."name" IS NULL`)
    await queryRunner.query(`ALTER TABLE "cycle" ALTER COLUMN "name" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP COLUMN "quarter"`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP COLUMN "fiscal_year"`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP COLUMN "active"`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP COLUMN "cadence"`)
    await queryRunner.query(`DROP TYPE "cycle_cadence_enum"`)
  }
}
