import { MigrationInterface, QueryRunner } from 'typeorm'

export class FixesKeyResultViewArray1609184218877 implements MigrationInterface {
  name = 'FixesKeyResultViewArray1609184218877'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result_view" DROP COLUMN "rank"`)
    await queryRunner.query(`ALTER TABLE "key_result_view" ADD "rank" uuid array`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result_view" DROP COLUMN "rank"`)
    await queryRunner.query(`ALTER TABLE "key_result_view" ADD "rank" text NOT NULL DEFAULT '[]'`)
  }
}
