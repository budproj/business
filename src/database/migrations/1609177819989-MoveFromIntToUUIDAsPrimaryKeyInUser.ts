import { MigrationInterface, QueryRunner } from 'typeorm'

export class MoveFromIntToUUIDAsPrimaryKeyInUser1609177819989 implements MigrationInterface {
  name = 'MoveFromIntToUUIDAsPrimaryKeyInUser1609177819989'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "key_result" DROP CONSTRAINT "FK_467fb7f46035c6aa81790e6c9f2"`,
    )
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "owner_id"`)
    await queryRunner.query(`ALTER TABLE "key_result" ADD "owner_id" uuid NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "confidence_report" DROP CONSTRAINT "FK_253a46d45187cc3e3eda9efa3de"`,
    )
    await queryRunner.query(`ALTER TABLE "confidence_report" DROP COLUMN "user_id"`)
    await queryRunner.query(`ALTER TABLE "confidence_report" ADD "user_id" uuid NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "progress_report" DROP CONSTRAINT "FK_171639bc8c15479933be60eefec"`,
    )
    await queryRunner.query(`ALTER TABLE "progress_report" DROP COLUMN "user_id"`)
    await queryRunner.query(`ALTER TABLE "progress_report" ADD "user_id" uuid NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "objective" DROP CONSTRAINT "FK_3e9e716f8dbeb75b4b8532d2145"`,
    )
    await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "owner_id"`)
    await queryRunner.query(`ALTER TABLE "objective" ADD "owner_id" uuid NOT NULL`)
    await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_a5111ebcad0cc858f6527f1f60a"`)
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "owner_id"`)
    await queryRunner.query(`ALTER TABLE "team" ADD "owner_id" uuid NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "key_result_view" DROP CONSTRAINT "FK_d7f88f19b2d4d892aea802f4e19"`,
    )
    await queryRunner.query(
      `ALTER TABLE "team_users_user" DROP CONSTRAINT "FK_32ddebb98d9272939aa84b3908a"`,
    )
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`)
    await queryRunner.query(`ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_view" DROP CONSTRAINT "UQ_1afc6f58de1c96d96bdbb441472"`,
    )
    await queryRunner.query(`ALTER TABLE "key_result_view" DROP COLUMN "user_id"`)
    await queryRunner.query(`ALTER TABLE "key_result_view" ADD "user_id" uuid NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "team_users_user" DROP CONSTRAINT "PK_1ca7d053d598bf3af832af0a82f"`,
    )
    await queryRunner.query(
      `ALTER TABLE "team_users_user" ADD CONSTRAINT "PK_3c5aba0d3c5727d0994abf770f0" PRIMARY KEY ("team_id")`,
    )
    await queryRunner.query(`DROP INDEX "IDX_32ddebb98d9272939aa84b3908"`)
    await queryRunner.query(`ALTER TABLE "team_users_user" DROP COLUMN "user_id"`)
    await queryRunner.query(`ALTER TABLE "team_users_user" ADD "user_id" uuid NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "team_users_user" DROP CONSTRAINT "PK_3c5aba0d3c5727d0994abf770f0"`,
    )
    await queryRunner.query(
      `ALTER TABLE "team_users_user" ADD CONSTRAINT "PK_1ca7d053d598bf3af832af0a82f" PRIMARY KEY ("team_id", "user_id")`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_32ddebb98d9272939aa84b3908" ON "team_users_user" ("user_id") `,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_view" ADD CONSTRAINT "UQ_1afc6f58de1c96d96bdbb441472" UNIQUE ("user_id", "binding")`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD CONSTRAINT "FK_467fb7f46035c6aa81790e6c9f2" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "confidence_report" ADD CONSTRAINT "FK_253a46d45187cc3e3eda9efa3de" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "progress_report" ADD CONSTRAINT "FK_171639bc8c15479933be60eefec" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "objective" ADD CONSTRAINT "FK_3e9e716f8dbeb75b4b8532d2145" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_a5111ebcad0cc858f6527f1f60a" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_view" ADD CONSTRAINT "FK_d7f88f19b2d4d892aea802f4e19" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "team_users_user" ADD CONSTRAINT "FK_32ddebb98d9272939aa84b3908a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team_users_user" DROP CONSTRAINT "FK_32ddebb98d9272939aa84b3908a"`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_view" DROP CONSTRAINT "FK_d7f88f19b2d4d892aea802f4e19"`,
    )
    await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_a5111ebcad0cc858f6527f1f60a"`)
    await queryRunner.query(
      `ALTER TABLE "objective" DROP CONSTRAINT "FK_3e9e716f8dbeb75b4b8532d2145"`,
    )
    await queryRunner.query(
      `ALTER TABLE "progress_report" DROP CONSTRAINT "FK_171639bc8c15479933be60eefec"`,
    )
    await queryRunner.query(
      `ALTER TABLE "confidence_report" DROP CONSTRAINT "FK_253a46d45187cc3e3eda9efa3de"`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result" DROP CONSTRAINT "FK_467fb7f46035c6aa81790e6c9f2"`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_view" DROP CONSTRAINT "UQ_1afc6f58de1c96d96bdbb441472"`,
    )
    await queryRunner.query(`DROP INDEX "IDX_32ddebb98d9272939aa84b3908"`)
    await queryRunner.query(
      `ALTER TABLE "team_users_user" DROP CONSTRAINT "PK_1ca7d053d598bf3af832af0a82f"`,
    )
    await queryRunner.query(
      `ALTER TABLE "team_users_user" ADD CONSTRAINT "PK_3c5aba0d3c5727d0994abf770f0" PRIMARY KEY ("team_id")`,
    )
    await queryRunner.query(`ALTER TABLE "team_users_user" DROP COLUMN "user_id"`)
    await queryRunner.query(`ALTER TABLE "team_users_user" ADD "user_id" integer NOT NULL`)
    await queryRunner.query(
      `CREATE INDEX "IDX_32ddebb98d9272939aa84b3908" ON "team_users_user" ("user_id") `,
    )
    await queryRunner.query(
      `ALTER TABLE "team_users_user" DROP CONSTRAINT "PK_3c5aba0d3c5727d0994abf770f0"`,
    )
    await queryRunner.query(
      `ALTER TABLE "team_users_user" ADD CONSTRAINT "PK_1ca7d053d598bf3af832af0a82f" PRIMARY KEY ("user_id", "team_id")`,
    )
    await queryRunner.query(`ALTER TABLE "key_result_view" DROP COLUMN "user_id"`)
    await queryRunner.query(`ALTER TABLE "key_result_view" ADD "user_id" integer NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "key_result_view" ADD CONSTRAINT "UQ_1afc6f58de1c96d96bdbb441472" UNIQUE ("binding", "user_id")`,
    )
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`)
    await queryRunner.query(`ALTER TABLE "user" ADD "id" SERIAL NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "team_users_user" ADD CONSTRAINT "FK_32ddebb98d9272939aa84b3908a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_view" ADD CONSTRAINT "FK_d7f88f19b2d4d892aea802f4e19" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "owner_id"`)
    await queryRunner.query(`ALTER TABLE "team" ADD "owner_id" integer NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_a5111ebcad0cc858f6527f1f60a" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "owner_id"`)
    await queryRunner.query(`ALTER TABLE "objective" ADD "owner_id" integer NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "objective" ADD CONSTRAINT "FK_3e9e716f8dbeb75b4b8532d2145" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(`ALTER TABLE "progress_report" DROP COLUMN "user_id"`)
    await queryRunner.query(`ALTER TABLE "progress_report" ADD "user_id" integer NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "progress_report" ADD CONSTRAINT "FK_171639bc8c15479933be60eefec" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(`ALTER TABLE "confidence_report" DROP COLUMN "user_id"`)
    await queryRunner.query(`ALTER TABLE "confidence_report" ADD "user_id" integer NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "confidence_report" ADD CONSTRAINT "FK_253a46d45187cc3e3eda9efa3de" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "owner_id"`)
    await queryRunner.query(`ALTER TABLE "key_result" ADD "owner_id" integer NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD CONSTRAINT "FK_467fb7f46035c6aa81790e6c9f2" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
