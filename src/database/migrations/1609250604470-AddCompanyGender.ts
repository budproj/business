import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddCompanyGender1609250604470 implements MigrationInterface {
  name = 'AddCompanyGender1609250604470'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "company_gender_enum" AS ENUM('MALE', 'FEMALE')`)
    await queryRunner.query(`ALTER TABLE "company" ADD "gender" "company_gender_enum"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "gender"`)
    await queryRunner.query(`DROP TYPE "company_gender_enum"`)
  }
}
