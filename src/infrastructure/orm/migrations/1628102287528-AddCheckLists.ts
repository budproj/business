import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddCheckLists1628102287528 implements MigrationInterface {
  name = 'AddCheckLists1628102287528'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "key_result_check_mark_state_enum" AS ENUM('checked', 'unchecked')`,
    )
    await queryRunner.query(
      `CREATE TABLE "key_result_check_mark" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "state" "key_result_check_mark_state_enum" NOT NULL DEFAULT 'unchecked', "description" text NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "key_result_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_47489c0abf6109f7942ea40f608" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_check_mark" ADD CONSTRAINT "FK_8bccb9f6b5cf3510a6fe4538f15" FOREIGN KEY ("key_result_id") REFERENCES "key_result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_check_mark" ADD CONSTRAINT "FK_92372053c4ad3e02262b154518c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "key_result_check_mark" DROP CONSTRAINT "FK_92372053c4ad3e02262b154518c"`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_check_mark" DROP CONSTRAINT "FK_8bccb9f6b5cf3510a6fe4538f15"`,
    )
    await queryRunner.query(`DROP TABLE "key_result_check_mark"`)
    await queryRunner.query(`DROP TYPE "key_result_check_mark_state_enum"`)
  }
}
