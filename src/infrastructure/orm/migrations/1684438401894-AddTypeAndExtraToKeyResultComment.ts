import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddTypeAndExtraToKeyResultComment1684438401894 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "key_result_comment_type_enum" AS ENUM('suggestion', 'praisal', 'question', 'alignment', 'improvement', 'issue', 'comment')`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_comment" ADD COLUMN "type" "key_result_comment_type_enum" NOT NULL DEFAULT 'comment'`,
    )

    await queryRunner.query(`ALTER TABLE "key_result_comment" ADD COLUMN "extra" json`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result_comment" DROP COLUMN "extra"`)
    await queryRunner.query(`ALTER TABLE "key_result_comment" DROP COLUMN "type"`)
    await queryRunner.query(`DROP TYPE "key_result_comment_type_enum"`)
  }
}
