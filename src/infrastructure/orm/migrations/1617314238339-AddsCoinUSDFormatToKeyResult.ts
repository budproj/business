import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddsCoinUSDFormatToKeyResult1617314238339 implements MigrationInterface {
  name = 'AddsCoinUSDFormatToKeyResult1617314238339'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."key_result_format_enum" RENAME TO "key_result_format_enum_old"`,
    )
    await queryRunner.query(
      `CREATE TYPE "key_result_format_enum" AS ENUM('NUMBER', 'PERCENTAGE', 'COIN_BRL', 'COIN_USD')`,
    )
    await queryRunner.query(`ALTER TABLE "key_result" ALTER COLUMN "format" DROP DEFAULT`)
    await queryRunner.query(
      `ALTER TABLE "key_result" ALTER COLUMN "format" TYPE "key_result_format_enum" USING "format"::"text"::"key_result_format_enum"`,
    )
    await queryRunner.query(`ALTER TABLE "key_result" ALTER COLUMN "format" SET DEFAULT 'NUMBER'`)
    await queryRunner.query(`DROP TYPE "key_result_format_enum_old"`)
    await queryRunner.query(`COMMENT ON COLUMN "key_result"."format" IS NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "key_result"."format" IS NULL`)
    await queryRunner.query(
      `CREATE TYPE "key_result_format_enum_old" AS ENUM('NUMBER', 'PERCENTAGE', 'COIN_BRL')`,
    )
    await queryRunner.query(`ALTER TABLE "key_result" ALTER COLUMN "format" DROP DEFAULT`)
    await queryRunner.query(
      `ALTER TABLE "key_result" ALTER COLUMN "format" TYPE "key_result_format_enum_old" USING "format"::"text"::"key_result_format_enum_old"`,
    )
    await queryRunner.query(`ALTER TABLE "key_result" ALTER COLUMN "format" SET DEFAULT 'NUMBER'`)
    await queryRunner.query(`DROP TYPE "key_result_format_enum"`)
    await queryRunner.query(
      `ALTER TYPE "key_result_format_enum_old" RENAME TO  "key_result_format_enum"`,
    )
  }
}
