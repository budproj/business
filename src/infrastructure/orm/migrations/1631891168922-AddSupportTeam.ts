import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSupportTeam1631891168922 implements MigrationInterface {
    name = 'AddSupportTeam1631891168922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "key_result_support_team_members_user" ("key_result_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_cf072cd276ba82de077931ff3e3" PRIMARY KEY ("key_result_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_26e20b123b7862eabb1a4ebaf4" ON "key_result_support_team_members_user" ("key_result_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e0c0bd63aa095eef909b4adb60" ON "key_result_support_team_members_user" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "key_result_support_team_members_user" ADD CONSTRAINT "FK_26e20b123b7862eabb1a4ebaf45" FOREIGN KEY ("key_result_id") REFERENCES "key_result"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "key_result_support_team_members_user" ADD CONSTRAINT "FK_e0c0bd63aa095eef909b4adb60c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "key_result_support_team_members_user" DROP CONSTRAINT "FK_e0c0bd63aa095eef909b4adb60c"`);
        await queryRunner.query(`ALTER TABLE "key_result_support_team_members_user" DROP CONSTRAINT "FK_26e20b123b7862eabb1a4ebaf45"`);
        await queryRunner.query(`DROP INDEX "IDX_e0c0bd63aa095eef909b4adb60"`);
        await queryRunner.query(`DROP INDEX "IDX_26e20b123b7862eabb1a4ebaf4"`);
        await queryRunner.query(`DROP TABLE "key_result_support_team_members_user"`);
    }

}
