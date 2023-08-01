import { MigrationInterface, QueryRunner } from 'typeorm'

export class LinkKeyResultWithTeam1605554594889 implements MigrationInterface {
  name = 'LinkKeyResultWithTeam1605554594889'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result" ADD "teamId" integer`)
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD CONSTRAINT "FK_8f841800119dceb55171f1ed710" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "key_result" DROP CONSTRAINT "FK_8f841800119dceb55171f1ed710"`,
    )
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "teamId"`)
  }
}
