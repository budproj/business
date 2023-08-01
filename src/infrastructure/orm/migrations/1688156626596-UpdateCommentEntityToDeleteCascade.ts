import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateCommentEntityToDeleteCascade1688156626596 implements MigrationInterface {
  name = 'UpdateCommentEntityToDeleteCascade1688156626596'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "key_result_comment" DROP CONSTRAINT "FK_fedcba0987654321fedcba0987"`,
    )

    await queryRunner.query(
      `ALTER TABLE "key_result_comment" ADD CONSTRAINT "FK_718ec8aa9d18b0da439a30515ba" FOREIGN KEY ("parent_id") REFERENCES "key_result_comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "key_result_comment" DROP CONSTRAINT "FK_718ec8aa9d18b0da439a30515ba"`,
    )

    await queryRunner.query(
      `ALTER TABLE "key_result_comment" ADD CONSTRAINT "FK_fedcba0987654321fedcba0987" FOREIGN KEY ("parent_id") REFERENCES "key_result_comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
