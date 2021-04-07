import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddInitialValueToKeyResult1605553425591 implements MigrationInterface {
  name = 'AddInitialValueToKeyResult1605553425591'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result" ADD "initialValue" numeric NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "initialValue"`)
  }
}
