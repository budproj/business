import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateNamingStrategy1605722152420 implements MigrationInterface {
  name = 'UpdateNamingStrategy1605722152420'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "confidence_report" DROP CONSTRAINT "FK_77abd95d6700ac3b4bb291fd0da"`,
    )
    await queryRunner.query(
      `ALTER TABLE "progress_report" DROP CONSTRAINT "FK_4b99dc1ce620819715fc4624dc6"`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result" DROP CONSTRAINT "FK_23a93a8313c2eeb141e72c30098"`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result" DROP CONSTRAINT "FK_8f841800119dceb55171f1ed710"`,
    )
    await queryRunner.query(
      `ALTER TABLE "objective" DROP CONSTRAINT "FK_bd6054d696adbee34dbb5bc7687"`,
    )
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "createdAt"`)
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "updatedAt"`)
    await queryRunner.query(`ALTER TABLE "confidence_report" DROP COLUMN "valuePrevious"`)
    await queryRunner.query(`ALTER TABLE "confidence_report" DROP COLUMN "valueNew"`)
    await queryRunner.query(`ALTER TABLE "confidence_report" DROP COLUMN "createdAt"`)
    await queryRunner.query(`ALTER TABLE "confidence_report" DROP COLUMN "keyResultId"`)
    await queryRunner.query(`ALTER TABLE "progress_report" DROP COLUMN "valuePrevious"`)
    await queryRunner.query(`ALTER TABLE "progress_report" DROP COLUMN "valueNew"`)
    await queryRunner.query(`ALTER TABLE "progress_report" DROP COLUMN "createdAt"`)
    await queryRunner.query(`ALTER TABLE "progress_report" DROP COLUMN "keyResultId"`)
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "createdAt"`)
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "objectiveId"`)
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "initialValue"`)
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "teamId"`)
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "updatedAt"`)
    await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "cycleId"`)
    await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "createdAt"`)
    await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "updatedAt"`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP COLUMN "dateStart"`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP COLUMN "dateEnd"`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP COLUMN "createdAt"`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP COLUMN "updatedAt"`)
    await queryRunner.query(`ALTER TABLE "team" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`)
    await queryRunner.query(`ALTER TABLE "team" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`)
    await queryRunner.query(`ALTER TABLE "confidence_report" ADD "value_previous" numeric NOT NULL`)
    await queryRunner.query(`ALTER TABLE "confidence_report" ADD "value_new" numeric NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "confidence_report" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(`ALTER TABLE "confidence_report" ADD "key_result_id" integer`)
    await queryRunner.query(`ALTER TABLE "progress_report" ADD "value_previous" numeric NOT NULL`)
    await queryRunner.query(`ALTER TABLE "progress_report" ADD "value_new" numeric NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "progress_report" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(`ALTER TABLE "progress_report" ADD "key_result_id" integer`)
    await queryRunner.query(`ALTER TABLE "key_result" ADD "initial_value" numeric NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(`ALTER TABLE "key_result" ADD "objective_id" integer`)
    await queryRunner.query(`ALTER TABLE "key_result" ADD "team_id" integer`)
    await queryRunner.query(
      `ALTER TABLE "objective" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "objective" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(`ALTER TABLE "objective" ADD "cycle_id" integer`)
    await queryRunner.query(`ALTER TABLE "cycle" ADD "date_start" TIMESTAMP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "cycle" ADD "date_end" TIMESTAMP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "cycle" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`)
    await queryRunner.query(`ALTER TABLE "cycle" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`)
    await queryRunner.query(
      `ALTER TABLE "confidence_report" ADD CONSTRAINT "FK_91d4c5e94a9a8c4aff1e001b03d" FOREIGN KEY ("key_result_id") REFERENCES "key_result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "progress_report" ADD CONSTRAINT "FK_2af2ca4de80e1b489b55a1e713b" FOREIGN KEY ("key_result_id") REFERENCES "key_result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD CONSTRAINT "FK_af1d41e09197fe425efd4c50ede" FOREIGN KEY ("objective_id") REFERENCES "objective"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD CONSTRAINT "FK_4ba6cf9e3b59bd10f6ef88aabf7" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "objective" ADD CONSTRAINT "FK_4134e15532a8beb1f20417cb14f" FOREIGN KEY ("cycle_id") REFERENCES "cycle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cycle" DROP CONSTRAINT "FK_c2a1e5c86d5a9157810191147b4"`)
    await queryRunner.query(
      `ALTER TABLE "objective" DROP CONSTRAINT "FK_4134e15532a8beb1f20417cb14f"`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result" DROP CONSTRAINT "FK_4ba6cf9e3b59bd10f6ef88aabf7"`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result" DROP CONSTRAINT "FK_af1d41e09197fe425efd4c50ede"`,
    )
    await queryRunner.query(
      `ALTER TABLE "progress_report" DROP CONSTRAINT "FK_2af2ca4de80e1b489b55a1e713b"`,
    )
    await queryRunner.query(
      `ALTER TABLE "confidence_report" DROP CONSTRAINT "FK_91d4c5e94a9a8c4aff1e001b03d"`,
    )
    await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_b36ca3769370f1fe4f5519e85f9"`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP COLUMN "updated_at"`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP COLUMN "created_at"`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP COLUMN "date_end"`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP COLUMN "date_start"`)
    await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "cycle_id"`)
    await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "updated_at"`)
    await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "created_at"`)
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "team_id"`)
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "objective_id"`)
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "updated_at"`)
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "created_at"`)
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "initial_value"`)
    await queryRunner.query(`ALTER TABLE "progress_report" DROP COLUMN "key_result_id"`)
    await queryRunner.query(`ALTER TABLE "progress_report" DROP COLUMN "created_at"`)
    await queryRunner.query(`ALTER TABLE "progress_report" DROP COLUMN "value_new"`)
    await queryRunner.query(`ALTER TABLE "progress_report" DROP COLUMN "value_previous"`)
    await queryRunner.query(`ALTER TABLE "confidence_report" DROP COLUMN "key_result_id"`)
    await queryRunner.query(`ALTER TABLE "confidence_report" DROP COLUMN "created_at"`)
    await queryRunner.query(`ALTER TABLE "confidence_report" DROP COLUMN "value_new"`)
    await queryRunner.query(`ALTER TABLE "confidence_report" DROP COLUMN "value_previous"`)
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "updated_at"`)
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "created_at"`)
    await queryRunner.query(`ALTER TABLE "cycle" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`)
    await queryRunner.query(`ALTER TABLE "cycle" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`)
    await queryRunner.query(`ALTER TABLE "cycle" ADD "dateEnd" TIMESTAMP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "cycle" ADD "dateStart" TIMESTAMP NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "objective" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "objective" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(`ALTER TABLE "objective" ADD "cycleId" integer`)
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(`ALTER TABLE "key_result" ADD "teamId" integer`)
    await queryRunner.query(`ALTER TABLE "key_result" ADD "initialValue" numeric NOT NULL`)
    await queryRunner.query(`ALTER TABLE "key_result" ADD "objectiveId" integer`)
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(`ALTER TABLE "progress_report" ADD "keyResultId" integer`)
    await queryRunner.query(
      `ALTER TABLE "progress_report" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(`ALTER TABLE "progress_report" ADD "valueNew" numeric NOT NULL`)
    await queryRunner.query(`ALTER TABLE "progress_report" ADD "valuePrevious" numeric NOT NULL`)
    await queryRunner.query(`ALTER TABLE "confidence_report" ADD "keyResultId" integer`)
    await queryRunner.query(
      `ALTER TABLE "confidence_report" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(`ALTER TABLE "confidence_report" ADD "valueNew" numeric NOT NULL`)
    await queryRunner.query(`ALTER TABLE "confidence_report" ADD "valuePrevious" numeric NOT NULL`)
    await queryRunner.query(`ALTER TABLE "team" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`)
    await queryRunner.query(`ALTER TABLE "team" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`)
    await queryRunner.query(
      `ALTER TABLE "objective" ADD CONSTRAINT "FK_bd6054d696adbee34dbb5bc7687" FOREIGN KEY ("cycleId") REFERENCES "cycle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD CONSTRAINT "FK_8f841800119dceb55171f1ed710" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD CONSTRAINT "FK_23a93a8313c2eeb141e72c30098" FOREIGN KEY ("objectiveId") REFERENCES "objective"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "progress_report" ADD CONSTRAINT "FK_4b99dc1ce620819715fc4624dc6" FOREIGN KEY ("keyResultId") REFERENCES "key_result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "confidence_report" ADD CONSTRAINT "FK_77abd95d6700ac3b4bb291fd0da" FOREIGN KEY ("keyResultId") REFERENCES "key_result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
