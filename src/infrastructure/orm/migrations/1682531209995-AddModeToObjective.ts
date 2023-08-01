import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddModeToObjective1682531209995 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "objective_mode_enum" AS ENUM('COMPLETED', 'PUBLISHED', 'DRAFT', 'DELETED')`)
    await queryRunner.query(
      `ALTER TABLE "objective" ADD COLUMN "mode" "objective_mode_enum" NOT NULL DEFAULT 'PUBLISHED'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "mode"`)
    await queryRunner.query(`DROP TYPE "objective_mode_enum"`)
  }
}
