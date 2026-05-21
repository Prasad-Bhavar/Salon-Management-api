import { MigrationInterface, QueryRunner } from "typeorm";

export class Addeddescriptioninservice1779254816517 implements MigrationInterface {
    name = 'Addeddescriptioninservice1779254816517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "salon_services" DROP CONSTRAINT "FK_d7924d20be498c5a43808d7e0dc"`);
        await queryRunner.query(`ALTER TABLE "salon_services" DROP COLUMN "service_id"`);
        await queryRunner.query(`ALTER TABLE "salon_services" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "salon_services" ADD "serviceId" integer`);
        await queryRunner.query(`ALTER TABLE "salon_services" ADD CONSTRAINT "FK_7d56822f8a8cb851f48d354552a" FOREIGN KEY ("serviceId") REFERENCES "services_master"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "salon_services" DROP CONSTRAINT "FK_7d56822f8a8cb851f48d354552a"`);
        await queryRunner.query(`ALTER TABLE "salon_services" DROP COLUMN "serviceId"`);
        await queryRunner.query(`ALTER TABLE "salon_services" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "salon_services" ADD "service_id" integer`);
        await queryRunner.query(`ALTER TABLE "salon_services" ADD CONSTRAINT "FK_d7924d20be498c5a43808d7e0dc" FOREIGN KEY ("service_id") REFERENCES "services_master"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
