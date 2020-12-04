import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddOwnerToCompany1607111678273 implements MigrationInterface {
  name = 'AddOwnerToCompany1607111678273'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "company" ADD "owner_id" integer NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "company" ADD CONSTRAINT "FK_0c6ea8a32565efcb512e572d61d" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company" DROP CONSTRAINT "FK_0c6ea8a32565efcb512e572d61d"`,
    )
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "owner_id"`)
  }
}
