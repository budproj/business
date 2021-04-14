import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChangesParentTeamColumnTitle1615835656993 implements MigrationInterface {
  name = 'ChangesParentTeamColumnTitle1615835656993'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cycle" DROP CONSTRAINT "FK_651f3cb28dd87b747909d0a5ed1"`)
    await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_a5304381cacfa7268cbbd069067"`)
    await queryRunner.query(`ALTER TABLE "team" RENAME COLUMN "parent_team_id" TO "parent_id"`)
    await queryRunner.query(
      `ALTER TABLE "cycle" ADD CONSTRAINT "FK_d698254d6a0a759a16c0edb5f1f" FOREIGN KEY ("parent_id") REFERENCES "cycle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_62f429bfbac9ccd28d3a63a3308" FOREIGN KEY ("parent_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_62f429bfbac9ccd28d3a63a3308"`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP CONSTRAINT "FK_d698254d6a0a759a16c0edb5f1f"`)
    await queryRunner.query(`ALTER TABLE "team" RENAME COLUMN "parent_id" TO "parent_team_id"`)
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_a5304381cacfa7268cbbd069067" FOREIGN KEY ("parent_team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "cycle" ADD CONSTRAINT "FK_651f3cb28dd87b747909d0a5ed1" FOREIGN KEY ("parent_id") REFERENCES "cycle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
