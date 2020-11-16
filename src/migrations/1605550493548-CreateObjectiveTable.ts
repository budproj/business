import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateObjectiveTable1605550493548 implements MigrationInterface {
    name = 'CreateObjectiveTable1605550493548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "objective" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_1084365b2a588160b31361a252e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "objective"`);
    }

}
