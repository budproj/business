import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdatesUserAboutSectionToLongText1614115061168 implements MigrationInterface {
  name = 'UpdatesUserAboutSectionToLongText1614115061168'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "about"`)
    await queryRunner.query(`ALTER TABLE "user" ADD "about" text`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "about"`)
    await queryRunner.query(`ALTER TABLE "user" ADD "about" character varying`)
  }
}
