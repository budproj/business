import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddTeamToObjective1624996496494 implements MigrationInterface {
  name = 'AddTeamToObjective1624996496494'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "objective" ADD "team_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "objective" ADD CONSTRAINT "FK_dd69c7763388baabca1306dd089" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `UPDATE "objective" SET "team_id"="objectives_main_team"."team_id" FROM (SELECT * FROM (SELECT DISTINCT ON("objective_id") "team_id", "objective_id", COUNT(*) as "count" FROM "key_result" GROUP BY "team_id", "objective_id") as "objective_teams" ORDER BY "count" DESC) as "objectives_main_team" WHERE "objective"."id"="objectives_main_team"."objective_id"`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "objective" DROP CONSTRAINT "FK_dd69c7763388baabca1306dd089"`)
    await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "team_id"`)
  }
}
