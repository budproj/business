import {MigrationInterface, QueryRunner} from "typeorm";

export class AddOwnerToTeam1607111029213 implements MigrationInterface {
    name = 'AddOwnerToTeam1607111029213'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team" ADD "owner_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_a5111ebcad0cc858f6527f1f60a" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_a5111ebcad0cc858f6527f1f60a"`);
        await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "owner_id"`);
    }

}
