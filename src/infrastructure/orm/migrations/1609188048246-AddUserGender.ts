import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUserGender1609188048246 implements MigrationInterface {
  name = 'AddUserGender1609188048246'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "user_gender_enum" AS ENUM('MALE', 'FEMALE')`)
    await queryRunner.query(`ALTER TABLE "user" ADD "gender" "user_gender_enum"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gender"`)
    await queryRunner.query(`DROP TYPE "user_gender_enum"`)
  }
}
