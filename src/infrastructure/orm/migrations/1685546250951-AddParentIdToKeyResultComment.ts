import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddParentIdToKeyResultComment1685546250951 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result_comment" ADD COLUMN "parent_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "key_result_comment" ADD CONSTRAINT "FK_fedcba0987654321fedcba0987" FOREIGN KEY ("parent_id") REFERENCES "key_result_comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result_comment" DROP CONSTRAINT "FK_fedcba0987654321fedcba0987"`)
    await queryRunner.query(`DROP COLUMN "parent_id"`)
  }
}
