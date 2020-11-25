import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFormatToKeyResult1606314925017 implements MigrationInterface {
    name = 'AddFormatToKeyResult1606314925017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "key_result_format_enum" AS ENUM('NUMBER', 'PERCENTAGE', 'COIN_BRL')`);
        await queryRunner.query(`ALTER TABLE "key_result" ADD "format" "key_result_format_enum" NOT NULL DEFAULT 'NUMBER'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "key_result" DROP COLUMN "format"`);
        await queryRunner.query(`DROP TYPE "key_result_format_enum"`);
    }

}
