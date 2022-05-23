import { MigrationInterface, QueryRunner } from 'typeorm'

export class KrsWithoutTeams1653324068241 implements MigrationInterface {
  name = 'KrsWithoutTeams1653324068241'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "key_result" DROP CONSTRAINT "FK_4ba6cf9e3b59bd10f6ef88aabf7"`,
    )
    await queryRunner.query(`ALTER TABLE "key_result" ALTER COLUMN "team_id" DROP NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD CONSTRAINT "FK_4ba6cf9e3b59bd10f6ef88aabf7" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "key_result" DROP CONSTRAINT "FK_4ba6cf9e3b59bd10f6ef88aabf7"`,
    )
    await queryRunner.query(`ALTER TABLE "key_result" ALTER COLUMN "team_id" SET NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD CONSTRAINT "FK_4ba6cf9e3b59bd10f6ef88aabf7" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
