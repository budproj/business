import { MigrationInterface, QueryRunner } from 'typeorm'

export class RequiredAssigneeToCheckMark1644951575317 implements MigrationInterface {
  name = 'RequiredAssigneeToCheckMark1644951575317'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE public.key_result_check_mark SET assigned_user_id = public.key_result_check_mark.user_id`,
    )

    await queryRunner.query(
      `ALTER TABLE "public"."key_result_check_mark" DROP CONSTRAINT "FK_ae0c75bf3fb0f798d1939825118"`,
    )
    await queryRunner.query(
      `ALTER TABLE "public"."key_result_check_mark" ALTER COLUMN "assigned_user_id" DROP NOT NULL`,
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
      `ALTER TABLE "public"."key_result_check_mark" ALTER COLUMN "assigned_user_id" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "public"."key_result_check_mark" ADD CONSTRAINT "FK_ae0c75bf3fb0f798d1939825118" FOREIGN KEY ("assigned_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
