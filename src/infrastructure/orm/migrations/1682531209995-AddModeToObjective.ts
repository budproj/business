import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddModeToObjective1682531209995 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "objective" ADD COLUMN "mode" text NOT NULL DEFAULT 'PUBLISHED'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "mode"`)
  }
}
