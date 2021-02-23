import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddsSettingsToUser1614113443573 implements MigrationInterface {
  name = 'AddsSettingsToUser1614113443573'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "nickname" character varying`)
    await queryRunner.query(`ALTER TABLE "user" ADD "about" character varying`)
    await queryRunner.query(`ALTER TABLE "user" ADD "linked_in_profile_address" character varying`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "linked_in_profile_address"`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "about"`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "nickname"`)
  }
}
