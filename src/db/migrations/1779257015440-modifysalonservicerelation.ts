import { MigrationInterface, QueryRunner } from "typeorm";

export class Modifysalonservicerelation1779257015440 implements MigrationInterface {
    name = 'Modifysalonservicerelation1779257015440'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "salon_services" DROP CONSTRAINT "FK_7d56822f8a8cb851f48d354552a"`);
        await queryRunner.query(`ALTER TABLE "salon_services" RENAME COLUMN "serviceId" TO "service_id"`);
        await queryRunner.query(`ALTER TABLE "salon_services" ADD CONSTRAINT "FK_d7924d20be498c5a43808d7e0dc" FOREIGN KEY ("service_id") REFERENCES "services_master"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "salon_services" DROP CONSTRAINT "FK_d7924d20be498c5a43808d7e0dc"`);
        await queryRunner.query(`ALTER TABLE "salon_services" RENAME COLUMN "service_id" TO "serviceId"`);
        await queryRunner.query(`ALTER TABLE "salon_services" ADD CONSTRAINT "FK_7d56822f8a8cb851f48d354552a" FOREIGN KEY ("serviceId") REFERENCES "services_master"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
