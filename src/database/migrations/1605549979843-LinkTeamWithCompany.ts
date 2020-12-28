import { MigrationInterface, QueryRunner } from 'typeorm'

export class LinkTeamWithCompany1605549979843 implements MigrationInterface {
  name = 'LinkTeamWithCompany1605549979843'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "team" ADD "companyId" integer`)
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_f621d803ce9f3284a559f68fbc5" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_f621d803ce9f3284a559f68fbc5"`)
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "companyId"`)
  }
}
