import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddRoleAndPictureToUser1605811740320 implements MigrationInterface {
  name = 'AddRoleAndPictureToUser1605811740320'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "role" character varying`)
    await queryRunner.query(`ALTER TABLE "user" ADD "picture" character varying`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "picture"`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`)
  }
}
