import { MigrationInterface, QueryRunner } from 'typeorm'

export class RenamePropertyOfKeyResultCheckinEntity1685713043836 implements MigrationInterface {
  name = 'RenamePropertyOfKeyResultCheckinEntity1685713043836'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "key_result_check_in" RENAME COLUMN "key_result_state_before_checkin" TO "previous_state"`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "key_result_check_in" RENAME COLUMN "previous_state" TO "key_result_state_before_checkin"`,
    )
  }
}
