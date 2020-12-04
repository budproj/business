import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddOwnerToObjective1607110154758 implements MigrationInterface {
  name = 'AddOwnerToObjective1607110154758'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "objective" ADD "owner_id" integer NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "objective" ADD CONSTRAINT "FK_3e9e716f8dbeb75b4b8532d2145" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "objective" DROP CONSTRAINT "FK_3e9e716f8dbeb75b4b8532d2145"`,
    )
    await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "owner_id"`)
  }
}
