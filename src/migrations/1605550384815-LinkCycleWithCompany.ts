import { MigrationInterface, QueryRunner } from 'typeorm'

export class LinkCycleWithCompany1605550384815 implements MigrationInterface {
  name = 'LinkCycleWithCompany1605550384815'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cycle" ADD "companyId" integer`)
    await queryRunner.query(
      `ALTER TABLE "cycle" ADD CONSTRAINT "FK_917072384ce255f37d62264fcdb" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cycle" DROP CONSTRAINT "FK_917072384ce255f37d62264fcdb"`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP COLUMN "companyId"`)
  }
}
