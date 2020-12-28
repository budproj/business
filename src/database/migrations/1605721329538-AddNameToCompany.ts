import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddNameToCompany1605721329538 implements MigrationInterface {
  name = 'AddNameToCompany1605721329538'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "company" ADD "name" character varying NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "name"`)
  }
}
