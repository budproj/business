import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddsOwnerToKeyResult1605554878321 implements MigrationInterface {
  name = 'AddsOwnerToKeyResult1605554878321'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result" ADD "owner" character varying NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "owner"`)
  }
}
