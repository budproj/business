import { MigrationInterface, QueryRunner } from 'typeorm'

export class MergesCompanyEntityWithTeam1609430094050 implements MigrationInterface {
  name = 'MergesCompanyEntityWithTeam1609430094050'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cycle" ADD "team_id" uuid NOT NULL`)
    await queryRunner.query(`CREATE TYPE "team_gender_enum" AS ENUM('MALE', 'FEMALE')`)
    await queryRunner.query(`ALTER TABLE "team" ADD "gender" "team_gender_enum"`)
    await queryRunner.query(
      `ALTER TABLE "cycle" ADD CONSTRAINT "FK_8dde18c98dc33bda257338936a7" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cycle" DROP CONSTRAINT "FK_8dde18c98dc33bda257338936a7"`)
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "gender"`)
    await queryRunner.query(`DROP TYPE "team_gender_enum"`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP COLUMN "team_id"`)
  }
}
