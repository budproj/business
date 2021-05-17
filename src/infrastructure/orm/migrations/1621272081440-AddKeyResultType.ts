import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddKeyResultType1621272081440 implements MigrationInterface {
  name = 'AddKeyResultType1621272081440'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "key_result_type_enum" AS ENUM('ASCENDING', 'DESCENDING')`)
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD "type" "key_result_type_enum" NOT NULL DEFAULT 'ASCENDING'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "type"`)
    await queryRunner.query(`DROP TYPE "key_result_type_enum"`)
  }
}
