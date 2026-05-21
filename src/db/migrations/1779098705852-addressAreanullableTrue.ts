import { MigrationInterface, QueryRunner } from "typeorm";

export class AddressAreanullableTrue1779098705852 implements MigrationInterface {
    name = 'AddressAreanullableTrue1779098705852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "addresses" ALTER COLUMN "area" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "addresses" ALTER COLUMN "area" SET NOT NULL`);
    }

}
