import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddKeyResultStateToCheckin1682602004881 implements MigrationInterface {
  name = 'AddKeyResultStateToCheckin1682602004881'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "key_result_check_in" ADD "key_result_state_before_checkin" json`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "key_result_check_in" DROP COLUMN "key_result_state_before_checkin"`,
    )
  }
}
