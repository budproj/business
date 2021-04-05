import { MigrationInterface, QueryRunner } from 'typeorm'

export class MoveFromIntToUUIDAsPrimaryKeyInObjective1609177488787 implements MigrationInterface {
  name = 'MoveFromIntToUUIDAsPrimaryKeyInObjective1609177488787'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "key_result" DROP CONSTRAINT "FK_af1d41e09197fe425efd4c50ede"`,
    )
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "objective_id"`)
    await queryRunner.query(`ALTER TABLE "key_result" ADD "objective_id" uuid NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "objective" DROP CONSTRAINT "PK_1084365b2a588160b31361a252e"`,
    )
    await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "id"`)
    await queryRunner.query(
      `ALTER TABLE "objective" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    )
    await queryRunner.query(
      `ALTER TABLE "objective" ADD CONSTRAINT "PK_1084365b2a588160b31361a252e" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD CONSTRAINT "FK_af1d41e09197fe425efd4c50ede" FOREIGN KEY ("objective_id") REFERENCES "objective"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "key_result" DROP CONSTRAINT "FK_af1d41e09197fe425efd4c50ede"`,
    )
    await queryRunner.query(
      `ALTER TABLE "objective" DROP CONSTRAINT "PK_1084365b2a588160b31361a252e"`,
    )
    await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "id"`)
    await queryRunner.query(`ALTER TABLE "objective" ADD "id" SERIAL NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "objective" ADD CONSTRAINT "PK_1084365b2a588160b31361a252e" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "objective_id"`)
    await queryRunner.query(`ALTER TABLE "key_result" ADD "objective_id" integer NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "key_result" ADD CONSTRAINT "FK_af1d41e09197fe425efd4c50ede" FOREIGN KEY ("objective_id") REFERENCES "objective"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
