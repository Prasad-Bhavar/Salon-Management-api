import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedTimestampsalonService1779196676347 implements MigrationInterface {
    name = 'AddedTimestampsalonService1779196676347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "salon_services" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "salon_services" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "salon_services" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "salon_services" DROP COLUMN "created_at"`);
    }

}
