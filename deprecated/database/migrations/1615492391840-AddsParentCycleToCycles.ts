import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddsParentCycleToCycles1615492391840 implements MigrationInterface {
  name = 'AddsParentCycleToCycles1615492391840'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cycle" ADD "parent_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "cycle" ADD CONSTRAINT "FK_651f3cb28dd87b747909d0a5ed1" FOREIGN KEY ("parent_id") REFERENCES "cycle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cycle" DROP CONSTRAINT "FK_651f3cb28dd87b747909d0a5ed1"`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP COLUMN "parent_id"`)
  }
}
