import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddNameToUser1606414721612 implements MigrationInterface {
  name = 'AddNameToUser1606414721612'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying`)
    await queryRunner.query(`UPDATE "user" SET "name" = 'Morty Smith' WHERE "name" IS NULL`)
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`)
  }
}
