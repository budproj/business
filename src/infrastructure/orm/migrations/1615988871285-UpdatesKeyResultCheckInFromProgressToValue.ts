import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdatesKeyResultCheckInFromProgressToValue1615988871285 implements MigrationInterface {
  name = 'UpdatesKeyResultCheckInFromProgressToValue1615988871285'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result_check_in" RENAME COLUMN "progress" TO "value"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result_check_in" RENAME COLUMN "value" TO "progress"`)
  }
}
