import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddsNeutralGenderToTeam1611168926943 implements MigrationInterface {
  name = 'AddsNeutralGenderToTeam1611168926943'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "public"."team_gender_enum" RENAME TO "team_gender_enum_old"`)
    await queryRunner.query(`CREATE TYPE "team_gender_enum" AS ENUM('MALE', 'FEMALE', 'NEUTRAL')`)
    await queryRunner.query(
      `ALTER TABLE "team" ALTER COLUMN "gender" TYPE "team_gender_enum" USING "gender"::"text"::"team_gender_enum"`,
    )
    await queryRunner.query(`DROP TYPE "team_gender_enum_old"`)
    await queryRunner.query(`COMMENT ON COLUMN "team"."gender" IS NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "team"."gender" IS NULL`)
    await queryRunner.query(`CREATE TYPE "team_gender_enum_old" AS ENUM('MALE', 'FEMALE')`)
    await queryRunner.query(
      `ALTER TABLE "team" ALTER COLUMN "gender" TYPE "team_gender_enum_old" USING "gender"::"text"::"team_gender_enum_old"`,
    )
    await queryRunner.query(`DROP TYPE "team_gender_enum"`)
    await queryRunner.query(`ALTER TYPE "team_gender_enum_old" RENAME TO  "team_gender_enum"`)
  }
}
