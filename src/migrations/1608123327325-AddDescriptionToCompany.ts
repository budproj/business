import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddDescriptionToCompany1608123327325 implements MigrationInterface {
  name = 'AddDescriptionToCompany1608123327325'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "company" ADD "description" text`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "description"`)
  }
}
