import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemoveKeyResultCustomList1616010887736 implements MigrationInterface {
  name = 'RemoveKeyResultCustomList1616010887736'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result_custom_list" DROP CONSTRAINT "FK_4fbf64548f1df09fdc936de7f9d"`)
    await queryRunner.query(`DROP TABLE "key_result_custom_list"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "key_result_custom_list_binding_enum" AS ENUM('MINE')`)
    await queryRunner.query(`CREATE TABLE "key_result_custom_list" AS (SELECT * FROM "key_result_view")`)
    await queryRunner.query(
      `ALTER TABLE "key_result_custom_list" ADD CONSTRAINT "FK_4fbf64548f1df09fdc936de7f9d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )

    await queryRunner.query(`ALTER TABLE "key_result_custom_list" ALTER COLUMN "id" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "key_result_custom_list" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`)

    await queryRunner.query(`ALTER TABLE "key_result_custom_list" ALTER COLUMN "created_at" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "key_result_custom_list" ALTER COLUMN "created_at" SET DEFAULT now()`)

    await queryRunner.query(`ALTER TABLE "key_result_custom_list" ALTER COLUMN "updated_at" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "key_result_custom_list" ALTER COLUMN "updated_at" SET DEFAULT now()`)

    await queryRunner.query(`ALTER TABLE "key_result_custom_list" ALTER COLUMN "user_id" SET NOT NULL`)

    await queryRunner.query(
      `ALTER TABLE "key_result_custom_list" ADD CONSTRAINT "PK_d111102a280de27c89ade4ea34f" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_custom_list" ADD CONSTRAINT "UQ_2a8e7ce4c6c64a3ac6229ac0b43" UNIQUE ("user_id", "binding")`,
    )
  }
}
