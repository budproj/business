import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddsCadenceAttributesToCycle1615296809147 implements MigrationInterface {
  name = 'AddsCadenceAttributesToCycle1615296809147'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "cycle_cadence_enum" AS ENUM('YEARLY', 'QUARTERLY')`)
    await queryRunner.query(`ALTER TABLE "cycle" ADD "cadence" "cycle_cadence_enum"`)
    await queryRunner.query(
      `UPDATE "cycle" SET cadence=(CASE WHEN (DATE_PART('month', date_end) - DATE_PART('month', date_start) > 3) then 'YEARLY'::"cycle_cadence_enum" else 'QUARTERLY'::"cycle_cadence_enum" END)`,
    )
    await queryRunner.query(`ALTER TABLE "cycle" ALTER COLUMN "cadence" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "cycle" ADD "active" boolean NOT NULL DEFAULT true`)
    await queryRunner.query(`ALTER TABLE "cycle" ALTER COLUMN "name" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "cycle" RENAME COLUMN "name" TO "title"`)
    await queryRunner.query(`COMMENT ON COLUMN "cycle"."title" IS NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "cycle"."title" IS NULL`)
    await queryRunner.query(`ALTER TABLE "cycle" ALTER COLUMN "title" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "cycle" RENAME COLUMN "title" TO "name"`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP COLUMN "active"`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP COLUMN "cadence"`)
    await queryRunner.query(`DROP TYPE "cycle_cadence_enum"`)
  }
}
