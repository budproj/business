import { MigrationInterface, QueryRunner } from 'typeorm'

export class MoveFromIntToUUIDAsPrimaryKeyInCycle1609176998922 implements MigrationInterface {
  name = 'MoveFromIntToUUIDAsPrimaryKeyInCycle1609176998922'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "objective" DROP CONSTRAINT "FK_4134e15532a8beb1f20417cb14f"`,
    )
    await queryRunner.query(`ALTER TABLE "cycle" DROP CONSTRAINT "PK_af5984cb5853f1f88109c9ea2b7"`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP COLUMN "id"`)
    await queryRunner.query(`ALTER TABLE "cycle" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`)
    await queryRunner.query(
      `ALTER TABLE "cycle" ADD CONSTRAINT "PK_af5984cb5853f1f88109c9ea2b7" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "cycle_id"`)
    await queryRunner.query(`ALTER TABLE "objective" ADD "cycle_id" uuid NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "objective" ADD CONSTRAINT "FK_4134e15532a8beb1f20417cb14f" FOREIGN KEY ("cycle_id") REFERENCES "cycle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "objective" DROP CONSTRAINT "FK_4134e15532a8beb1f20417cb14f"`,
    )
    await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "cycle_id"`)
    await queryRunner.query(`ALTER TABLE "objective" ADD "cycle_id" integer NOT NULL`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP CONSTRAINT "PK_af5984cb5853f1f88109c9ea2b7"`)
    await queryRunner.query(`ALTER TABLE "cycle" DROP COLUMN "id"`)
    await queryRunner.query(`ALTER TABLE "cycle" ADD "id" SERIAL NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "cycle" ADD CONSTRAINT "PK_af5984cb5853f1f88109c9ea2b7" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "objective" ADD CONSTRAINT "FK_4134e15532a8beb1f20417cb14f" FOREIGN KEY ("cycle_id") REFERENCES "cycle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
