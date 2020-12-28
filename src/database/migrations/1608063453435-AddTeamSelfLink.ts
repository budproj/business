import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddTeamSelfLink1608063453435 implements MigrationInterface {
  name = 'AddTeamSelfLink1608063453435'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "team" ADD "parent_team_id" integer`)
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_a5304381cacfa7268cbbd069067" FOREIGN KEY ("parent_team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_a5304381cacfa7268cbbd069067"`)
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "parent_team_id"`)
  }
}
