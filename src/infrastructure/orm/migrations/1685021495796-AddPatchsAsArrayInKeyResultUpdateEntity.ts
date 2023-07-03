import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddPatchsAsArrayInKeyResultUpdateEntity1685021495796 implements MigrationInterface {
  name = 'AddPatchsAsArrayInKeyResultUpdateEntity1685021495796'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result_update" DROP COLUMN "patches"`)
    await queryRunner.query(`ALTER TABLE "key_result_update" ADD "patches" json array NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result_update" DROP COLUMN "patches"`)
    await queryRunner.query(`ALTER TABLE "key_result_update" ADD "patches" json NOT NULL`)
  }
}
