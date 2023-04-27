import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddModeToKeyResult1682618181950 implements MigrationInterface {
  name = 'AddModeToKeyResult1682618181950'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."key_result_mode_enum" AS ENUM('COMPLETED', 'PUBLISHED', 'DRAFT', 'DELETED')`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD "mode" "public"."key_result_mode_enum" NOT NULL DEFAULT 'PUBLISHED'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "mode"`)
    await queryRunner.query(`DROP TYPE "public"."key_result_mode_enum"`)
  }
}
