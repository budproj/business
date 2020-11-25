import {MigrationInterface, QueryRunner} from "typeorm";

export class ImprovesDataStructure1606311152838 implements MigrationInterface {
    name = 'ImprovesDataStructure1606311152838'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "confidence_report" DROP CONSTRAINT "FK_91d4c5e94a9a8c4aff1e001b03d"`);
        await queryRunner.query(`ALTER TABLE "confidence_report" DROP CONSTRAINT "FK_253a46d45187cc3e3eda9efa3de"`);
        await queryRunner.query(`ALTER TABLE "confidence_report" ALTER COLUMN "value_previous" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "confidence_report"."value_previous" IS NULL`);
        await queryRunner.query(`ALTER TABLE "confidence_report" ALTER COLUMN "key_result_id" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "confidence_report"."key_result_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "confidence_report" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "confidence_report"."user_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "cycle" DROP CONSTRAINT "FK_c2a1e5c86d5a9157810191147b4"`);
        await queryRunner.query(`ALTER TABLE "cycle" ALTER COLUMN "company_id" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "cycle"."company_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "key_result_view" DROP CONSTRAINT "FK_d7f88f19b2d4d892aea802f4e19"`);
        await queryRunner.query(`ALTER TABLE "key_result_view" DROP CONSTRAINT "UQ_1afc6f58de1c96d96bdbb441472"`);
        await queryRunner.query(`ALTER TABLE "key_result_view" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "key_result_view"."user_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "key_result" DROP CONSTRAINT "FK_467fb7f46035c6aa81790e6c9f2"`);
        await queryRunner.query(`ALTER TABLE "key_result" DROP CONSTRAINT "FK_af1d41e09197fe425efd4c50ede"`);
        await queryRunner.query(`ALTER TABLE "key_result" DROP CONSTRAINT "FK_4ba6cf9e3b59bd10f6ef88aabf7"`);
        await queryRunner.query(`ALTER TABLE "key_result" ALTER COLUMN "owner_id" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "key_result"."owner_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "key_result" ALTER COLUMN "objective_id" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "key_result"."objective_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "key_result" ALTER COLUMN "team_id" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "key_result"."team_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "objective" DROP CONSTRAINT "FK_4134e15532a8beb1f20417cb14f"`);
        await queryRunner.query(`ALTER TABLE "objective" ALTER COLUMN "cycle_id" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "objective"."cycle_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "progress_report" DROP CONSTRAINT "FK_2af2ca4de80e1b489b55a1e713b"`);
        await queryRunner.query(`ALTER TABLE "progress_report" DROP CONSTRAINT "FK_171639bc8c15479933be60eefec"`);
        await queryRunner.query(`ALTER TABLE "progress_report" ALTER COLUMN "value_previous" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "progress_report"."value_previous" IS NULL`);
        await queryRunner.query(`ALTER TABLE "progress_report" ALTER COLUMN "key_result_id" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "progress_report"."key_result_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "progress_report" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "progress_report"."user_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_b36ca3769370f1fe4f5519e85f9"`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "company_id" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "team"."company_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "key_result_view" ADD CONSTRAINT "UQ_1afc6f58de1c96d96bdbb441472" UNIQUE ("user_id", "binding")`);
        await queryRunner.query(`ALTER TABLE "confidence_report" ADD CONSTRAINT "FK_91d4c5e94a9a8c4aff1e001b03d" FOREIGN KEY ("key_result_id") REFERENCES "key_result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "confidence_report" ADD CONSTRAINT "FK_253a46d45187cc3e3eda9efa3de" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cycle" ADD CONSTRAINT "FK_c2a1e5c86d5a9157810191147b4" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "key_result_view" ADD CONSTRAINT "FK_d7f88f19b2d4d892aea802f4e19" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "key_result" ADD CONSTRAINT "FK_467fb7f46035c6aa81790e6c9f2" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "key_result" ADD CONSTRAINT "FK_af1d41e09197fe425efd4c50ede" FOREIGN KEY ("objective_id") REFERENCES "objective"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "key_result" ADD CONSTRAINT "FK_4ba6cf9e3b59bd10f6ef88aabf7" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "objective" ADD CONSTRAINT "FK_4134e15532a8beb1f20417cb14f" FOREIGN KEY ("cycle_id") REFERENCES "cycle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "progress_report" ADD CONSTRAINT "FK_2af2ca4de80e1b489b55a1e713b" FOREIGN KEY ("key_result_id") REFERENCES "key_result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "progress_report" ADD CONSTRAINT "FK_171639bc8c15479933be60eefec" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_b36ca3769370f1fe4f5519e85f9" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_b36ca3769370f1fe4f5519e85f9"`);
        await queryRunner.query(`ALTER TABLE "progress_report" DROP CONSTRAINT "FK_171639bc8c15479933be60eefec"`);
        await queryRunner.query(`ALTER TABLE "progress_report" DROP CONSTRAINT "FK_2af2ca4de80e1b489b55a1e713b"`);
        await queryRunner.query(`ALTER TABLE "objective" DROP CONSTRAINT "FK_4134e15532a8beb1f20417cb14f"`);
        await queryRunner.query(`ALTER TABLE "key_result" DROP CONSTRAINT "FK_4ba6cf9e3b59bd10f6ef88aabf7"`);
        await queryRunner.query(`ALTER TABLE "key_result" DROP CONSTRAINT "FK_af1d41e09197fe425efd4c50ede"`);
        await queryRunner.query(`ALTER TABLE "key_result" DROP CONSTRAINT "FK_467fb7f46035c6aa81790e6c9f2"`);
        await queryRunner.query(`ALTER TABLE "key_result_view" DROP CONSTRAINT "FK_d7f88f19b2d4d892aea802f4e19"`);
        await queryRunner.query(`ALTER TABLE "cycle" DROP CONSTRAINT "FK_c2a1e5c86d5a9157810191147b4"`);
        await queryRunner.query(`ALTER TABLE "confidence_report" DROP CONSTRAINT "FK_253a46d45187cc3e3eda9efa3de"`);
        await queryRunner.query(`ALTER TABLE "confidence_report" DROP CONSTRAINT "FK_91d4c5e94a9a8c4aff1e001b03d"`);
        await queryRunner.query(`ALTER TABLE "key_result_view" DROP CONSTRAINT "UQ_1afc6f58de1c96d96bdbb441472"`);
        await queryRunner.query(`COMMENT ON COLUMN "team"."company_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "company_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_b36ca3769370f1fe4f5519e85f9" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`COMMENT ON COLUMN "progress_report"."user_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "progress_report" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "progress_report"."key_result_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "progress_report" ALTER COLUMN "key_result_id" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "progress_report"."value_previous" IS NULL`);
        await queryRunner.query(`ALTER TABLE "progress_report" ALTER COLUMN "value_previous" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "progress_report" ADD CONSTRAINT "FK_171639bc8c15479933be60eefec" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "progress_report" ADD CONSTRAINT "FK_2af2ca4de80e1b489b55a1e713b" FOREIGN KEY ("key_result_id") REFERENCES "key_result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`COMMENT ON COLUMN "objective"."cycle_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "objective" ALTER COLUMN "cycle_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "objective" ADD CONSTRAINT "FK_4134e15532a8beb1f20417cb14f" FOREIGN KEY ("cycle_id") REFERENCES "cycle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`COMMENT ON COLUMN "key_result"."team_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "key_result" ALTER COLUMN "team_id" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "key_result"."objective_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "key_result" ALTER COLUMN "objective_id" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "key_result"."owner_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "key_result" ALTER COLUMN "owner_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "key_result" ADD CONSTRAINT "FK_4ba6cf9e3b59bd10f6ef88aabf7" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "key_result" ADD CONSTRAINT "FK_af1d41e09197fe425efd4c50ede" FOREIGN KEY ("objective_id") REFERENCES "objective"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "key_result" ADD CONSTRAINT "FK_467fb7f46035c6aa81790e6c9f2" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`COMMENT ON COLUMN "key_result_view"."user_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "key_result_view" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "key_result_view" ADD CONSTRAINT "UQ_1afc6f58de1c96d96bdbb441472" UNIQUE ("binding", "user_id")`);
        await queryRunner.query(`ALTER TABLE "key_result_view" ADD CONSTRAINT "FK_d7f88f19b2d4d892aea802f4e19" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`COMMENT ON COLUMN "cycle"."company_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "cycle" ALTER COLUMN "company_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cycle" ADD CONSTRAINT "FK_c2a1e5c86d5a9157810191147b4" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`COMMENT ON COLUMN "confidence_report"."user_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "confidence_report" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "confidence_report"."key_result_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "confidence_report" ALTER COLUMN "key_result_id" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "confidence_report"."value_previous" IS NULL`);
        await queryRunner.query(`ALTER TABLE "confidence_report" ALTER COLUMN "value_previous" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "confidence_report" ADD CONSTRAINT "FK_253a46d45187cc3e3eda9efa3de" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "confidence_report" ADD CONSTRAINT "FK_91d4c5e94a9a8c4aff1e001b03d" FOREIGN KEY ("key_result_id") REFERENCES "key_result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
