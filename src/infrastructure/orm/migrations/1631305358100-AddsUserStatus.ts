import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddsUserStatus1631305358100 implements MigrationInterface {
  name = 'AddsUserStatus1631305358100'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`)
    await queryRunner.query(
      `ALTER TABLE "public"."user" ADD "status" "public"."user_status_enum" NOT NULL DEFAULT 'ACTIVE'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "status"`)
    await queryRunner.query(`DROP TYPE "public"."user_status_enum"`)
  }
}
