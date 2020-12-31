import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddsCreateAndUpdateDateToEntities1605554787852 implements MigrationInterface {
  name = 'AddsCreateAndUpdateDateToEntities1605554787852'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cycle" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`)
    await queryRunner.query(`ALTER TABLE "cycle" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`)
    await queryRunner.query(
      `ALTER TABLE "objective" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "objective" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(`ALTER TABLE "team" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`)
    await queryRunner.query(`ALTER TABLE "team" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "updatedAt"`)
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "createdAt"`)
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "updatedAt"`)
    await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "updatedAt"`)
    await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "createdAt"`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP COLUMN "updatedAt"`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP COLUMN "createdAt"`)
  }
}
