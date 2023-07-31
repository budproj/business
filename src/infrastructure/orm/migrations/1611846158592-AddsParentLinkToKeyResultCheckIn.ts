import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddsParentLinkToKeyResultCheckIn1611846158592 implements MigrationInterface {
  name = 'AddsParentLinkToKeyResultCheckIn1611846158592'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result_check_in" ADD "parent_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "key_result_check_in" ADD CONSTRAINT "UQ_984108e53a65231866cc0750ffd" UNIQUE ("parent_id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_check_in" ADD CONSTRAINT "FK_984108e53a65231866cc0750ffd" FOREIGN KEY ("parent_id") REFERENCES "key_result_check_in"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result_check_in" DROP CONSTRAINT "FK_984108e53a65231866cc0750ffd"`)
    await queryRunner.query(`ALTER TABLE "key_result_check_in" DROP CONSTRAINT "UQ_984108e53a65231866cc0750ffd"`)
    await queryRunner.query(`ALTER TABLE "key_result_check_in" DROP COLUMN "parent_id"`)
  }
}
