import { MigrationInterface, QueryRunner } from 'typeorm'

export class LinkKeyResultWithObjective1605551334075 implements MigrationInterface {
  name = 'LinkKeyResultWithObjective1605551334075'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result" ADD "objectiveId" integer`)
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD CONSTRAINT "FK_23a93a8313c2eeb141e72c30098" FOREIGN KEY ("objectiveId") REFERENCES "objective"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "key_result" DROP CONSTRAINT "FK_23a93a8313c2eeb141e72c30098"`,
    )
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "objectiveId"`)
  }
}
