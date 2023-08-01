import { MigrationInterface, QueryRunner } from 'typeorm'

export class RenameKeyResultViewToKeyResultCustomList1611682078949 implements MigrationInterface {
  name = 'RenameKeyResultViewToKeyResultCustomList1611682078949'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "key_result_view_binding_enum" RENAME TO "key_result_custom_list_binding_enum"`,
    )
    await queryRunner.query(
      `CREATE TABLE "key_result_custom_list" AS (SELECT * FROM "key_result_view")`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_custom_list" ADD CONSTRAINT "FK_4fbf64548f1df09fdc936de7f9d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )

    await queryRunner.query(`ALTER TABLE "key_result_custom_list" ALTER COLUMN "id" SET NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "key_result_custom_list" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    )

    await queryRunner.query(
      `ALTER TABLE "key_result_custom_list" ALTER COLUMN "created_at" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_custom_list" ALTER COLUMN "created_at" SET DEFAULT now()`,
    )

    await queryRunner.query(
      `ALTER TABLE "key_result_custom_list" ALTER COLUMN "updated_at" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_custom_list" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    )

    await queryRunner.query(
      `ALTER TABLE "key_result_custom_list" ALTER COLUMN "user_id" SET NOT NULL`,
    )

    await queryRunner.query(
      `ALTER TABLE "key_result_custom_list" ADD CONSTRAINT "PK_d111102a280de27c89ade4ea34f" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_custom_list" ADD CONSTRAINT "UQ_2a8e7ce4c6c64a3ac6229ac0b43" UNIQUE ("user_id", "binding")`,
    )

    await queryRunner.query(
      `ALTER TABLE "key_result_view" DROP CONSTRAINT "FK_d7f88f19b2d4d892aea802f4e19"`,
    )
    await queryRunner.query(`DROP TABLE "key_result_view"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "key_result_custom_list_binding_enum" RENAME TO "key_result_view_binding_enum"`,
    )

    await queryRunner.query(
      `CREATE TABLE "key_result_view" AS (SELECT * FROM "key_result_custom_list")`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_view" ADD CONSTRAINT "FK_d7f88f19b2d4d892aea802f4e19" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )

    await queryRunner.query(`ALTER TABLE "key_result_view" ALTER COLUMN "id" SET NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "key_result_view" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    )

    await queryRunner.query(`ALTER TABLE "key_result_view" ALTER COLUMN "created_at" SET NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "key_result_view" ALTER COLUMN "created_at" SET DEFAULT now()`,
    )

    await queryRunner.query(`ALTER TABLE "key_result_view" ALTER COLUMN "updated_at" SET NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "key_result_view" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    )

    await queryRunner.query(`ALTER TABLE "key_result_view" ALTER COLUMN "user_id" SET NOT NULL`)

    await queryRunner.query(
      `ALTER TABLE "key_result_view" ADD CONSTRAINT "PK_950d4d004c13f848b979c4a54b6" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_view" ADD CONSTRAINT "UQ_1afc6f58de1c96d96bdbb441472" UNIQUE ("user_id", "binding")`,
    )

    await queryRunner.query(
      `ALTER TABLE "key_result_custom_list" DROP CONSTRAINT "FK_4fbf64548f1df09fdc936de7f9d"`,
    )
    await queryRunner.query(`DROP TABLE "key_result_custom_list"`)
  }
}
