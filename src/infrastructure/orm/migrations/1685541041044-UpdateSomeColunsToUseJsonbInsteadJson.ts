import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateSomeColunsToUseJsonbInsteadJson1685541041044 implements MigrationInterface {
  name = 'UpdateSomeColunsToUseJsonbInsteadJson1685541041044'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result_check_in" DROP COLUMN "key_result_state_before_checkin"`)
    await queryRunner.query(`ALTER TABLE "key_result_check_in" ADD "key_result_state_before_checkin" jsonb`)
    await queryRunner.query(`ALTER TABLE "key_result_update" DROP COLUMN "old_state"`)
    await queryRunner.query(`ALTER TABLE "key_result_update" ADD "old_state" jsonb NOT NULL`)
    await queryRunner.query(`ALTER TABLE "key_result_update" DROP COLUMN "patches"`)
    await queryRunner.query(`ALTER TABLE "key_result_update" ADD "patches" jsonb NOT NULL`)
    await queryRunner.query(`ALTER TABLE "key_result_update" DROP COLUMN "new_state"`)
    await queryRunner.query(`ALTER TABLE "key_result_update" ADD "new_state" jsonb NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result_update" DROP COLUMN "new_state"`)
    await queryRunner.query(`ALTER TABLE "key_result_update" ADD "new_state" json NOT NULL`)
    await queryRunner.query(`ALTER TABLE "key_result_update" DROP COLUMN "patches"`)
    await queryRunner.query(`ALTER TABLE "key_result_update" ADD "patches" json NOT NULL`)
    await queryRunner.query(`ALTER TABLE "key_result_update" DROP COLUMN "old_state"`)
    await queryRunner.query(`ALTER TABLE "key_result_update" ADD "old_state" json NOT NULL`)
    await queryRunner.query(`ALTER TABLE "key_result_check_in" DROP COLUMN "key_result_state_before_checkin"`)
    await queryRunner.query(`ALTER TABLE "key_result_check_in" ADD "key_result_state_before_checkin" json`)
  }
}
