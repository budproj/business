import { MigrationInterface, QueryRunner } from 'typeorm'

export class MoveFromIntToUUIDAsPrimaryKeyInTeam1609177596663 implements MigrationInterface {
  name = 'MoveFromIntToUUIDAsPrimaryKeyInTeam1609177596663'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "key_result" DROP CONSTRAINT "FK_4ba6cf9e3b59bd10f6ef88aabf7"`,
    )
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "team_id"`)
    await queryRunner.query(`ALTER TABLE "key_result" ADD "team_id" uuid NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "team_users_user" DROP CONSTRAINT "FK_3c5aba0d3c5727d0994abf770f0"`,
    )
    await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_a5304381cacfa7268cbbd069067"`)
    await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "PK_f57d8293406df4af348402e4b74"`)
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "id"`)
    await queryRunner.query(`ALTER TABLE "team" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`)
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "parent_team_id"`)
    await queryRunner.query(`ALTER TABLE "team" ADD "parent_team_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "team_users_user" DROP CONSTRAINT "PK_1ca7d053d598bf3af832af0a82f"`,
    )
    await queryRunner.query(
      `ALTER TABLE "team_users_user" ADD CONSTRAINT "PK_32ddebb98d9272939aa84b3908a" PRIMARY KEY ("user_id")`,
    )
    await queryRunner.query(`DROP INDEX "IDX_3c5aba0d3c5727d0994abf770f"`)
    await queryRunner.query(`ALTER TABLE "team_users_user" DROP COLUMN "team_id"`)
    await queryRunner.query(`ALTER TABLE "team_users_user" ADD "team_id" uuid NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "team_users_user" DROP CONSTRAINT "PK_32ddebb98d9272939aa84b3908a"`,
    )
    await queryRunner.query(
      `ALTER TABLE "team_users_user" ADD CONSTRAINT "PK_1ca7d053d598bf3af832af0a82f" PRIMARY KEY ("user_id", "team_id")`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_3c5aba0d3c5727d0994abf770f" ON "team_users_user" ("team_id") `,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD CONSTRAINT "FK_4ba6cf9e3b59bd10f6ef88aabf7" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_a5304381cacfa7268cbbd069067" FOREIGN KEY ("parent_team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "team_users_user" ADD CONSTRAINT "FK_3c5aba0d3c5727d0994abf770f0" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team_users_user" DROP CONSTRAINT "FK_3c5aba0d3c5727d0994abf770f0"`,
    )
    await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_a5304381cacfa7268cbbd069067"`)
    await queryRunner.query(
      `ALTER TABLE "key_result" DROP CONSTRAINT "FK_4ba6cf9e3b59bd10f6ef88aabf7"`,
    )
    await queryRunner.query(`DROP INDEX "IDX_3c5aba0d3c5727d0994abf770f"`)
    await queryRunner.query(
      `ALTER TABLE "team_users_user" DROP CONSTRAINT "PK_1ca7d053d598bf3af832af0a82f"`,
    )
    await queryRunner.query(
      `ALTER TABLE "team_users_user" ADD CONSTRAINT "PK_32ddebb98d9272939aa84b3908a" PRIMARY KEY ("user_id")`,
    )
    await queryRunner.query(`ALTER TABLE "team_users_user" DROP COLUMN "team_id"`)
    await queryRunner.query(`ALTER TABLE "team_users_user" ADD "team_id" integer NOT NULL`)
    await queryRunner.query(
      `CREATE INDEX "IDX_3c5aba0d3c5727d0994abf770f" ON "team_users_user" ("team_id") `,
    )
    await queryRunner.query(
      `ALTER TABLE "team_users_user" DROP CONSTRAINT "PK_32ddebb98d9272939aa84b3908a"`,
    )
    await queryRunner.query(
      `ALTER TABLE "team_users_user" ADD CONSTRAINT "PK_1ca7d053d598bf3af832af0a82f" PRIMARY KEY ("team_id", "user_id")`,
    )
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "parent_team_id"`)
    await queryRunner.query(`ALTER TABLE "team" ADD "parent_team_id" integer`)
    await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "PK_f57d8293406df4af348402e4b74"`)
    await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "id"`)
    await queryRunner.query(`ALTER TABLE "team" ADD "id" SERIAL NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_a5304381cacfa7268cbbd069067" FOREIGN KEY ("parent_team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "team_users_user" ADD CONSTRAINT "FK_3c5aba0d3c5727d0994abf770f0" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "team_id"`)
    await queryRunner.query(`ALTER TABLE "key_result" ADD "team_id" integer NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD CONSTRAINT "FK_4ba6cf9e3b59bd10f6ef88aabf7" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
