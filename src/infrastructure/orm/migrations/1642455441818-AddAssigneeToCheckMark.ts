import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddAssigneeToCheckMark1642455441818 implements MigrationInterface {
  name = 'AddAssigneeToCheckMark1642455441818'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."key_result_check_mark" ADD "assigned_user_id" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "public"."key_result_check_mark" ADD CONSTRAINT "FK_ae0c75bf3fb0f798d1939825118" FOREIGN KEY ("assigned_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."key_result_check_mark" DROP CONSTRAINT "FK_ae0c75bf3fb0f798d1939825118"`,
    )
    await queryRunner.query(
      `ALTER TABLE "public"."key_result_check_mark" DROP COLUMN "assigned_user_id"`,
    )
  }
}
