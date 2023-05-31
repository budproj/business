import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddPatchAsSimpleJsonOnKeyResultUpdate1685407518609 implements MigrationInterface {
  name = 'AddPatchAsSimpleJsonOnKeyResultUpdate1685407518609'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result_update" DROP COLUMN "patches"`)
    await queryRunner.query(`ALTER TABLE "key_result_update" ADD "patches" json NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result_update" DROP COLUMN "patches"`)
    await queryRunner.query(`ALTER TABLE "key_result_update" ADD "patches" json array NOT NULL`)
  }
}
