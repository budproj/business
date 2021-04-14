import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddsCommentEntityToKeyResult1612272860351 implements MigrationInterface {
  name = 'AddsCommentEntityToKeyResult1612272860351'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "key_result_comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "key_result_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_58eec85fe36487951bfd30c755e" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_comment" ADD CONSTRAINT "FK_d74632d008ba9d845cd4a6a6093" FOREIGN KEY ("key_result_id") REFERENCES "key_result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_comment" ADD CONSTRAINT "FK_bbf5483ca6b4f1b29bf493a4ef2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "key_result_comment" DROP CONSTRAINT "FK_bbf5483ca6b4f1b29bf493a4ef2"`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_comment" DROP CONSTRAINT "FK_d74632d008ba9d845cd4a6a6093"`,
    )
    await queryRunner.query(`DROP TABLE "key_result_comment"`)
  }
}
