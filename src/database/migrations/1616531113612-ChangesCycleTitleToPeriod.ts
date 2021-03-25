import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChangesCycleTitleToPeriod1616531113612 implements MigrationInterface {
  name = 'ChangesCycleTitleToPeriod1616531113612'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cycle" RENAME COLUMN "title" TO "period"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cycle" RENAME COLUMN "period" TO "title"`)
  }
}
