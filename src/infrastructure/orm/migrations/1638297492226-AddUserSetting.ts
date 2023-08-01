import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUserSetting1638297492226 implements MigrationInterface {
  name = 'AddUserSetting1638297492226'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "user_setting_key_enum" AS ENUM('LOCALE')`)
    await queryRunner.query(
      `CREATE TABLE "user_setting" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "key" "user_setting_key_enum" NOT NULL, "value" character varying NOT NULL, "user_id" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f3791d237cf4cc8e4524f22a535" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_setting" ADD CONSTRAINT "FK_94922c04577bc2bc75f2faba53d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_setting" DROP CONSTRAINT "FK_94922c04577bc2bc75f2faba53d"`)
    await queryRunner.query(`DROP TABLE "user_setting"`)
    await queryRunner.query(`DROP TYPE "user_setting_key_enum"`)
  }
}
