import { MigrationInterface, QueryRunner } from 'typeorm'

export class goalCurrency1659633494216 implements MigrationInterface {
  name = 'goalCurrency1659633494216'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "public"."key_result_format_enum" RENAME TO "key_result_format_enum_old"`)
    await queryRunner.query(
      `CREATE TYPE "public"."key_result_format_enum" AS ENUM('NUMBER', 'PERCENTAGE', 'COIN_BRL', 'COIN_USD', 'COIN_EUR', 'COIN_GBP')`,
    )
    await queryRunner.query(`ALTER TABLE "key_result" ALTER COLUMN "format" DROP DEFAULT`)
    await queryRunner.query(
      `ALTER TABLE "key_result" ALTER COLUMN "format" TYPE "public"."key_result_format_enum" USING "format"::"text"::"public"."key_result_format_enum"`,
    )
    await queryRunner.query(`ALTER TABLE "key_result" ALTER COLUMN "format" SET DEFAULT 'NUMBER'`)
    await queryRunner.query(`DROP TYPE "public"."key_result_format_enum_old"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."key_result_format_enum_old" AS ENUM('NUMBER', 'PERCENTAGE', 'COIN_BRL', 'COIN_USD')`,
    )
    await queryRunner.query(`ALTER TABLE "key_result" ALTER COLUMN "format" DROP DEFAULT`)
    await queryRunner.query(
      `ALTER TABLE "key_result" ALTER COLUMN "format" TYPE "public"."key_result_format_enum_old" USING "format"::"text"::"public"."key_result_format_enum_old"`,
    )
    await queryRunner.query(`ALTER TABLE "key_result" ALTER COLUMN "format" SET DEFAULT 'NUMBER'`)
    await queryRunner.query(`DROP TYPE "public"."key_result_format_enum"`)
    await queryRunner.query(`ALTER TYPE "public"."key_result_format_enum_old" RENAME TO "key_result_format_enum"`)
  }
}
