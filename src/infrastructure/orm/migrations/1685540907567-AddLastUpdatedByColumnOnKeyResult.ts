import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddLastUpdatedByColumnOnKeyResult1685540907567 implements MigrationInterface {
  name = 'AddLastUpdatedByColumnOnKeyResult1685540907567'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result" ADD "last_updated_by" jsonb`)
    await queryRunner.query(
      `CREATE INDEX "IDX_49bdbdde40273408aee8ab67f6" ON "key_result" ("mode", "team_id", "updated_at") `,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_49bdbdde40273408aee8ab67f6"`)
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "last_updated_by"`)
  }
}
