import { MigrationInterface, QueryRunner } from 'typeorm'

export class SplitsNameIntoFirstAndLastNames1610478253510 implements MigrationInterface {
  name = 'SplitsNameIntoFirstAndLastNames1610478253510'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "first_name" character varying`)
    await queryRunner.query(`ALTER TABLE "user" ADD "last_name" character varying`)

    await queryRunner.query(
      'UPDATE "user" SET first_name=spplited_name.first_name, last_name=spplited_name.last_name FROM (SELECT id, name, SUBSTRING(name FROM \'(.*) \') AS first_name, SUBSTRING(name FROM \' (.*)\') AS last_name  FROM "user") AS spplited_name WHERE "user".id=spplited_name.id',
    )
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "first_name" SET NOT NULL')

    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "last_name"`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "first_name"`)
    await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying NOT NULL`)
  }
}
