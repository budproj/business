import { MigrationInterface, QueryRunner } from 'typeorm'

export class FixJoinTable1605723718556 implements MigrationInterface {
  name = 'FixJoinTable1605723718556'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "team_users_user" ("team_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_1ca7d053d598bf3af832af0a82f" PRIMARY KEY ("team_id", "user_id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_3c5aba0d3c5727d0994abf770f" ON "team_users_user" ("team_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_32ddebb98d9272939aa84b3908" ON "team_users_user" ("user_id") `,
    )
    await queryRunner.query(
      `ALTER TABLE "team_users_user" ADD CONSTRAINT "FK_3c5aba0d3c5727d0994abf770f0" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
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
      `ALTER TABLE "team_users_user" DROP CONSTRAINT "FK_3c5aba0d3c5727d0994abf770f0"`,
    )
    await queryRunner.query(`DROP INDEX "IDX_32ddebb98d9272939aa84b3908"`)
    await queryRunner.query(`DROP INDEX "IDX_3c5aba0d3c5727d0994abf770f"`)
    await queryRunner.query(`DROP TABLE "team_users_user"`)
  }
}
