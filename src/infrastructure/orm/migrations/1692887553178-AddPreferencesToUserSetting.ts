import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddPreferencesToUserSetting1692887553178 implements MigrationInterface {
  name = 'AddPreferencesToUserSetting1692887553178'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_setting" ADD COLUMN "preferences" jsonb NOT NULL DEFAULT '{"main_team": "" }'`,
    )

    await queryRunner.query(
      `UPDATE user_setting
      SET preferences = jsonb_set(
          preferences, 
          '{main_team}', 
          to_jsonb(
              (SELECT t.parent_id
               FROM team_users_user tuu
               JOIN team t ON tuu.team_id = t.id
               WHERE tuu.user_id = user_setting.user_id
               LIMIT 1)
          )
      )
      WHERE preferences->>'main_team' = '';`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user_setting', 'preferences')
  }
}
