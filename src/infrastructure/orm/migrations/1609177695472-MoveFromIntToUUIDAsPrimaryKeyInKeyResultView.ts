import { MigrationInterface, QueryRunner } from 'typeorm'

export class MoveFromIntToUUIDAsPrimaryKeyInKeyResultView1609177695472 implements MigrationInterface {
  name = 'MoveFromIntToUUIDAsPrimaryKeyInKeyResultView1609177695472'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result_view" DROP CONSTRAINT "PK_950d4d004c13f848b979c4a54b6"`)
    await queryRunner.query(`ALTER TABLE "key_result_view" DROP COLUMN "id"`)
    await queryRunner.query(`ALTER TABLE "key_result_view" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`)
    await queryRunner.query(
      `ALTER TABLE "key_result_view" ADD CONSTRAINT "PK_950d4d004c13f848b979c4a54b6" PRIMARY KEY ("id")`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result_view" DROP CONSTRAINT "PK_950d4d004c13f848b979c4a54b6"`)
    await queryRunner.query(`ALTER TABLE "key_result_view" DROP COLUMN "id"`)
    await queryRunner.query(`ALTER TABLE "key_result_view" ADD "id" SERIAL NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "key_result_view" ADD CONSTRAINT "PK_950d4d004c13f848b979c4a54b6" PRIMARY KEY ("id")`,
    )
  }
}
