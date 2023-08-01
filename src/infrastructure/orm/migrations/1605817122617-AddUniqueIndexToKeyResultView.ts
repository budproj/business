import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUniqueIndexToKeyResultView1605817122617 implements MigrationInterface {
  name = 'AddUniqueIndexToKeyResultView1605817122617'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "key_result_view" ADD CONSTRAINT "UQ_1afc6f58de1c96d96bdbb441472" UNIQUE ("user_id", "binding")`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result_view" DROP CONSTRAINT "UQ_1afc6f58de1c96d96bdbb441472"`)
  }
}
