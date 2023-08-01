import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddKeyResultView1605815979323 implements MigrationInterface {
  name = 'AddKeyResultView1605815979323'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "key_result_view_binding_enum" AS ENUM('MINE')`)
    await queryRunner.query(
      `CREATE TABLE "key_result_view" ("id" SERIAL NOT NULL, "title" character varying, "binding" "key_result_view_binding_enum", "rank" text NOT NULL DEFAULT '[]', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_950d4d004c13f848b979c4a54b6" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_view" ADD CONSTRAINT "FK_d7f88f19b2d4d892aea802f4e19" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result_view" DROP CONSTRAINT "FK_d7f88f19b2d4d892aea802f4e19"`)
    await queryRunner.query(`DROP TABLE "key_result_view"`)
    await queryRunner.query(`DROP TYPE "key_result_view_binding_enum"`)
  }
}
