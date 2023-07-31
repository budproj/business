import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddTask1648146279087 implements MigrationInterface {
  name = 'AddTask1648146279087'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."task_state_enum" AS ENUM('checked', 'unchecked')`)
    await queryRunner.query(
      `CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "assigned_user_id" uuid, "description" text NOT NULL, "state" "public"."task_state_enum" NOT NULL DEFAULT 'unchecked', CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_6ea2c1c13f01b7a383ebbeaebb0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_f3172a11cafc66aa03fded6cf8c" FOREIGN KEY ("assigned_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_f3172a11cafc66aa03fded6cf8c"`)
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_6ea2c1c13f01b7a383ebbeaebb0"`)
    await queryRunner.query(`DROP TABLE "task"`)
    await queryRunner.query(`DROP TYPE "public"."task_state_enum"`)
  }
}
