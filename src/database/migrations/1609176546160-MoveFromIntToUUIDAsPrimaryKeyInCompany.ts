import { MigrationInterface, QueryRunner } from 'typeorm'

export class MoveFromIntToUUIDAsPrimaryKeyInCompany1609176546160 implements MigrationInterface {
  name = 'MoveFromIntToUUIDAsPrimaryKeyInCompany1609176546160'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cycle" DROP CONSTRAINT "FK_c2a1e5c86d5a9157810191147b4"`)
    await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_b36ca3769370f1fe4f5519e85f9"`)
    await queryRunner.query(
      `ALTER TABLE "company" DROP CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20"`,
    )
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "id"`)
    await queryRunner.query(
      `ALTER TABLE "company" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    )
    await queryRunner.query(
      `ALTER TABLE "company" ADD CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(`ALTER TABLE "cycle" DROP COLUMN "company_id"`)
    await queryRunner.query(`ALTER TABLE "cycle" ADD "company_id" uuid NOT NULL`)
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "company_id"`)
    await queryRunner.query(`ALTER TABLE "team" ADD "company_id" uuid NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "cycle" ADD CONSTRAINT "FK_c2a1e5c86d5a9157810191147b4" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_b36ca3769370f1fe4f5519e85f9" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_b36ca3769370f1fe4f5519e85f9"`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP CONSTRAINT "FK_c2a1e5c86d5a9157810191147b4"`)
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "company_id"`)
    await queryRunner.query(`ALTER TABLE "team" ADD "company_id" integer NOT NULL`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP COLUMN "company_id"`)
    await queryRunner.query(`ALTER TABLE "cycle" ADD "company_id" integer NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "company" DROP CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20"`,
    )
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "id"`)
    await queryRunner.query(`ALTER TABLE "company" ADD "id" SERIAL NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "company" ADD CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_b36ca3769370f1fe4f5519e85f9" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "cycle" ADD CONSTRAINT "FK_c2a1e5c86d5a9157810191147b4" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
