import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddsNameToCycle1609868988264 implements MigrationInterface {
  name = 'AddsNameToCycle1609868988264'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cycle" ADD "name" character varying`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cycle" DROP COLUMN "name"`)
  }
}
