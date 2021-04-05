import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddDescriptionToTeam1608070880951 implements MigrationInterface {
  name = 'AddDescriptionToTeam1608070880951'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "team" ADD "description" text`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "description"`)
  }
}
