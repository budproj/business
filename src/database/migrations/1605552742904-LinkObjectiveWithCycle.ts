import { MigrationInterface, QueryRunner } from 'typeorm'

export class LinkObjectiveWithCycle1605552742904 implements MigrationInterface {
  name = 'LinkObjectiveWithCycle1605552742904'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "objective" ADD "cycleId" integer`)
    await queryRunner.query(
      `ALTER TABLE "objective" ADD CONSTRAINT "FK_bd6054d696adbee34dbb5bc7687" FOREIGN KEY ("cycleId") REFERENCES "cycle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "objective" DROP CONSTRAINT "FK_bd6054d696adbee34dbb5bc7687"`,
    )
    await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "cycleId"`)
  }
}
