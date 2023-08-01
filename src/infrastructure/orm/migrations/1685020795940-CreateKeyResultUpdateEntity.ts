import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateKeyResultUpdateEntity1685020795940 implements MigrationInterface {
  name = 'CreateKeyResultUpdateEntity1685020795940'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "key_result_update" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "key_result_id" uuid NOT NULL, "old_state" json NOT NULL, "patches" json NOT NULL, "new_state" json NOT NULL, CONSTRAINT "PK_d1d24d6a1d1069e293fe24f50d6" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_3da987eb78c41fc8cdee9a7bd0" ON "key_result_update" ("key_result_id", "created_at") `,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result_update" ADD CONSTRAINT "FK_79e196d6feb35798ca22aaf932f" FOREIGN KEY ("key_result_id") REFERENCES "key_result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "key_result_update" DROP CONSTRAINT "FK_79e196d6feb35798ca22aaf932f"`,
    )
    await queryRunner.query(`DROP INDEX "public"."IDX_3da987eb78c41fc8cdee9a7bd0"`)
    await queryRunner.query(`DROP TABLE "key_result_update"`)
  }
}
