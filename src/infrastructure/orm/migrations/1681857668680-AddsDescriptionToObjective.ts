import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddsDescriptionToObjective1681857668680 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "objective" ADD "description" character varying`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "description"`)
  }
}
