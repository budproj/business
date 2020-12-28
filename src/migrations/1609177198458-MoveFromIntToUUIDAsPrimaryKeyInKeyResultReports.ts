import { MigrationInterface, QueryRunner } from 'typeorm'

export class MoveFromIntToUUIDAsPrimaryKeyInKeyResultReports1609177198458
  implements MigrationInterface {
  name = 'MoveFromIntToUUIDAsPrimaryKeyInKeyResultReports1609177198458'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "confidence_report" DROP CONSTRAINT "PK_e196920f2067001715f1e029804"`,
    )
    await queryRunner.query(`ALTER TABLE "confidence_report" DROP COLUMN "id"`)
    await queryRunner.query(
      `ALTER TABLE "confidence_report" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    )
    await queryRunner.query(
      `ALTER TABLE "confidence_report" ADD CONSTRAINT "PK_e196920f2067001715f1e029804" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "progress_report" DROP CONSTRAINT "PK_de44d4f311d5a0132f49f9f0820"`,
    )
    await queryRunner.query(`ALTER TABLE "progress_report" DROP COLUMN "id"`)
    await queryRunner.query(
      `ALTER TABLE "progress_report" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    )
    await queryRunner.query(
      `ALTER TABLE "progress_report" ADD CONSTRAINT "PK_de44d4f311d5a0132f49f9f0820" PRIMARY KEY ("id")`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "progress_report" DROP CONSTRAINT "PK_de44d4f311d5a0132f49f9f0820"`,
    )
    await queryRunner.query(`ALTER TABLE "progress_report" DROP COLUMN "id"`)
    await queryRunner.query(`ALTER TABLE "progress_report" ADD "id" SERIAL NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "progress_report" ADD CONSTRAINT "PK_de44d4f311d5a0132f49f9f0820" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "confidence_report" DROP CONSTRAINT "PK_e196920f2067001715f1e029804"`,
    )
    await queryRunner.query(`ALTER TABLE "confidence_report" DROP COLUMN "id"`)
    await queryRunner.query(`ALTER TABLE "confidence_report" ADD "id" SERIAL NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "confidence_report" ADD CONSTRAINT "PK_e196920f2067001715f1e029804" PRIMARY KEY ("id")`,
    )
  }
}
