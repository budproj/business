import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUserTable1605722948043 implements MigrationInterface {
  name = 'AddUserTable1605722948043'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "confidence_report" RENAME COLUMN "user" TO "user_id"`)
    await queryRunner.query(`ALTER TABLE "progress_report" RENAME COLUMN "user" TO "user_id"`)
    await queryRunner.query(`ALTER TABLE "key_result" RENAME COLUMN "owner" TO "owner_id"`)
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "authz_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`ALTER TABLE "confidence_report" DROP COLUMN "user_id"`)
    await queryRunner.query(`ALTER TABLE "confidence_report" ADD "user_id" integer`)
    await queryRunner.query(`ALTER TABLE "progress_report" DROP COLUMN "user_id"`)
    await queryRunner.query(`ALTER TABLE "progress_report" ADD "user_id" integer`)
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "owner_id"`)
    await queryRunner.query(`ALTER TABLE "key_result" ADD "owner_id" integer`)
    await queryRunner.query(
      `ALTER TABLE "confidence_report" ADD CONSTRAINT "FK_253a46d45187cc3e3eda9efa3de" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "progress_report" ADD CONSTRAINT "FK_171639bc8c15479933be60eefec" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD CONSTRAINT "FK_467fb7f46035c6aa81790e6c9f2" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "key_result" DROP CONSTRAINT "FK_467fb7f46035c6aa81790e6c9f2"`)
    await queryRunner.query(`ALTER TABLE "progress_report" DROP CONSTRAINT "FK_171639bc8c15479933be60eefec"`)
    await queryRunner.query(`ALTER TABLE "confidence_report" DROP CONSTRAINT "FK_253a46d45187cc3e3eda9efa3de"`)
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "owner_id"`)
    await queryRunner.query(`ALTER TABLE "key_result" ADD "owner_id" character varying NOT NULL`)
    await queryRunner.query(`ALTER TABLE "progress_report" DROP COLUMN "user_id"`)
    await queryRunner.query(`ALTER TABLE "progress_report" ADD "user_id" character varying NOT NULL`)
    await queryRunner.query(`ALTER TABLE "confidence_report" DROP COLUMN "user_id"`)
    await queryRunner.query(`ALTER TABLE "confidence_report" ADD "user_id" character varying NOT NULL`)
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`ALTER TABLE "key_result" RENAME COLUMN "owner_id" TO "owner"`)
    await queryRunner.query(`ALTER TABLE "progress_report" RENAME COLUMN "user_id" TO "user"`)
    await queryRunner.query(`ALTER TABLE "confidence_report" RENAME COLUMN "user_id" TO "user"`)
  }
}
