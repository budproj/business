import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddPreferencesToUserSetting1692887553178 implements MigrationInterface {
  name = 'AddPreferencesToUserSetting1692887553178'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_setting" ADD COLUMN "preferences" jsonb NOT NULL DEFAULT '{"main_team": null }'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user_setting', 'preferences')
  }
}
