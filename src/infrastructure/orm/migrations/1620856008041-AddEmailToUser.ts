import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddEmailToUser1620856008041 implements MigrationInterface {
  name = 'AddEmailToUser1620856008041'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS citext`)
    await queryRunner.query(`ALTER TABLE "user" ADD "email" citext`)
    await queryRunner.query(`UPDATE "user" SET email='unknown@unknown'`)
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`)
  }
}
