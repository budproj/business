import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddModeToKeyResult1682618181950 implements MigrationInterface {
  name = 'AddModeToKeyResult1682618181950'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result" ADD "mode" text NOT NULL DEFAULT 'PUBLISHED'`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "mode"`)
  }
}
