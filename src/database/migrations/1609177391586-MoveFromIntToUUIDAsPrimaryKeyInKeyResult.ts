import { MigrationInterface, QueryRunner } from 'typeorm'

export class MoveFromIntToUUIDAsPrimaryKeyInKeyResult1609177391586 implements MigrationInterface {
  name = 'MoveFromIntToUUIDAsPrimaryKeyInKeyResult1609177391586'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "confidence_report" DROP CONSTRAINT "FK_91d4c5e94a9a8c4aff1e001b03d"`,
    )
    await queryRunner.query(
      `ALTER TABLE "progress_report" DROP CONSTRAINT "FK_2af2ca4de80e1b489b55a1e713b"`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result" DROP CONSTRAINT "PK_9064c5abe9ba68432934564d43f"`,
    )
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "id"`)
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD CONSTRAINT "PK_9064c5abe9ba68432934564d43f" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(`ALTER TABLE "confidence_report" DROP COLUMN "key_result_id"`)
    await queryRunner.query(`ALTER TABLE "confidence_report" ADD "key_result_id" uuid NOT NULL`)
    await queryRunner.query(`ALTER TABLE "progress_report" DROP COLUMN "key_result_id"`)
    await queryRunner.query(`ALTER TABLE "progress_report" ADD "key_result_id" uuid NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "confidence_report" ADD CONSTRAINT "FK_91d4c5e94a9a8c4aff1e001b03d" FOREIGN KEY ("key_result_id") REFERENCES "key_result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "progress_report" ADD CONSTRAINT "FK_2af2ca4de80e1b489b55a1e713b" FOREIGN KEY ("key_result_id") REFERENCES "key_result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "progress_report" DROP CONSTRAINT "FK_2af2ca4de80e1b489b55a1e713b"`,
    )
    await queryRunner.query(
      `ALTER TABLE "confidence_report" DROP CONSTRAINT "FK_91d4c5e94a9a8c4aff1e001b03d"`,
    )
    await queryRunner.query(`ALTER TABLE "progress_report" DROP COLUMN "key_result_id"`)
    await queryRunner.query(`ALTER TABLE "progress_report" ADD "key_result_id" integer NOT NULL`)
    await queryRunner.query(`ALTER TABLE "confidence_report" DROP COLUMN "key_result_id"`)
    await queryRunner.query(`ALTER TABLE "confidence_report" ADD "key_result_id" integer NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "key_result" DROP CONSTRAINT "PK_9064c5abe9ba68432934564d43f"`,
    )
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "id"`)
    await queryRunner.query(`ALTER TABLE "key_result" ADD "id" SERIAL NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD CONSTRAINT "PK_9064c5abe9ba68432934564d43f" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "progress_report" ADD CONSTRAINT "FK_2af2ca4de80e1b489b55a1e713b" FOREIGN KEY ("key_result_id") REFERENCES "key_result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "confidence_report" ADD CONSTRAINT "FK_91d4c5e94a9a8c4aff1e001b03d" FOREIGN KEY ("key_result_id") REFERENCES "key_result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
