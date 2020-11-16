import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateCycleTable1605550159362 implements MigrationInterface {
    name = 'CreateCycleTable1605550159362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cycle" ("id" SERIAL NOT NULL, "dateStart" TIMESTAMP NOT NULL, "dateEnd" TIMESTAMP NOT NULL, CONSTRAINT "PK_af5984cb5853f1f88109c9ea2b7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "cycle"`);
    }

}
