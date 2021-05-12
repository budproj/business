import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddEmailToUser1620858800262 implements MigrationInterface {
  name = 'AddEmailToUser1620858800262'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS citext`)
    await queryRunner.query(`ALTER TABLE "user" ADD "email" citext`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`,
    )
    await queryRunner.query(
      `UPDATE "user" SET "email"=(CONCAT(uuid_generate_v4(),'@',uuid_generate_v4()))`,
    )
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`)
  }
}
