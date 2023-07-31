import { MigrationInterface, QueryRunner } from 'typeorm'

export class MovesToCheckInEntity1611691340975 implements MigrationInterface {
  name = 'MovesToCheckInEntity1611691340975'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "key_result_check_in" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "progress" real NOT NULL, "confidence" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "key_result_id" uuid NOT NULL, "user_id" uuid NOT NULL, "comment" text, CONSTRAINT "PK_32838fec4e2916067f9e4919d4c" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_check_in" ADD CONSTRAINT "FK_a566969fc314f93d678c30566b4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_check_in" ADD CONSTRAINT "FK_e3828c8587b64a30f69401290e3" FOREIGN KEY ("key_result_id") REFERENCES "key_result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )

    await queryRunner.query(
      `INSERT INTO "key_result_check_in"(progress, confidence, created_at, key_result_id, user_id, comment) SELECT pr.value_new AS progress, COALESCE(cr.value_new, 100) AS confidence, pr.created_at, pr.key_result_id, pr.user_id, COALESCE(pr.comment, cr.comment) AS comment FROM progress_report as pr FULL OUTER JOIN confidence_report as cr ON pr.key_result_id=cr.key_result_id AND (pr.comment = cr.comment OR date_trunc('minute', pr.created_at) = date_trunc('minute', cr.created_at))`,
    )

    await queryRunner.query(`ALTER TABLE "progress_report" DROP CONSTRAINT "FK_171639bc8c15479933be60eefec"`)
    await queryRunner.query(`ALTER TABLE "progress_report" DROP CONSTRAINT "FK_2af2ca4de80e1b489b55a1e713b"`)
    await queryRunner.query(`DROP TABLE "progress_report"`)

    await queryRunner.query(`ALTER TABLE "confidence_report" DROP CONSTRAINT "FK_253a46d45187cc3e3eda9efa3de"`)
    await queryRunner.query(`ALTER TABLE "confidence_report" DROP CONSTRAINT "FK_91d4c5e94a9a8c4aff1e001b03d"`)
    await queryRunner.query(`DROP TABLE "confidence_report"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "progress_report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value_new" real NOT NULL, "valuePrevious" real, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "key_result_id" uuid NOT NULL, "user_id" uuid NOT NULL, "comment" text, CONSTRAINT "PK_de44d4f311d5a0132f49f9f0820" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "progress_report" ADD CONSTRAINT "FK_171639bc8c15479933be60eefec" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "progress_report" ADD CONSTRAINT "FK_2af2ca4de80e1b489b55a1e713b" FOREIGN KEY ("key_result_id") REFERENCES "key_result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `INSERT INTO "progress_report"(value_new, created_at, key_result_id, user_id, comment) SELECT progress, created_at, key_result_id, user_id, comment FROM key_result_check_in`,
    )

    await queryRunner.query(
      `CREATE TABLE "confidence_report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value_new" integer NOT NULL, "valuePrevious" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "key_result_id" uuid NOT NULL, "user_id" uuid NOT NULL, "comment" text, CONSTRAINT "PK_e196920f2067001715f1e029804" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "confidence_report" ADD CONSTRAINT "FK_253a46d45187cc3e3eda9efa3de" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "confidence_report" ADD CONSTRAINT "FK_91d4c5e94a9a8c4aff1e001b03d" FOREIGN KEY ("key_result_id") REFERENCES "key_result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `INSERT INTO "confidence_report"(value_new, created_at, key_result_id, user_id, comment) SELECT confidence, created_at, key_result_id, user_id, comment FROM key_result_check_in`,
    )

    await queryRunner.query(`ALTER TABLE "key_result_check_in" DROP CONSTRAINT "FK_a566969fc314f93d678c30566b4"`)
    await queryRunner.query(`ALTER TABLE "key_result_check_in" DROP CONSTRAINT "FK_e3828c8587b64a30f69401290e3"`)
    await queryRunner.query(`DROP TABLE "key_result_check_in"`)
  }
}
