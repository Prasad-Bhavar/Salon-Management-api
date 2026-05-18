import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedtheemailAndContactToSalonMoudule1779082780970 implements MigrationInterface {
    name = 'AddedtheemailAndContactToSalonMoudule1779082780970'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "salons" ADD "email" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "salons" ADD "contact_number" character varying(20)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "salons" DROP COLUMN "contact_number"`);
        await queryRunner.query(`ALTER TABLE "salons" DROP COLUMN "email"`);
    }

}
