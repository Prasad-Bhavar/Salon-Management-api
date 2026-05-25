import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedFavouritemodel1779355762011 implements MigrationInterface {
    name = 'AddedFavouritemodel1779355762011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "favorite_salons" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "customer_id" integer, "salon_id" integer, CONSTRAINT "UQ_222146bdc606a9981dd6f4287af" UNIQUE ("customer_id", "salon_id"), CONSTRAINT "PK_9d351b8303b300d381cbd563346" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "favorite_salons" ADD CONSTRAINT "FK_7f3464d6cbbc66e17f644e4b26e" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite_salons" ADD CONSTRAINT "FK_64338f9a1a198499f3ca630d883" FOREIGN KEY ("salon_id") REFERENCES "salons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorite_salons" DROP CONSTRAINT "FK_64338f9a1a198499f3ca630d883"`);
        await queryRunner.query(`ALTER TABLE "favorite_salons" DROP CONSTRAINT "FK_7f3464d6cbbc66e17f644e4b26e"`);
        await queryRunner.query(`DROP TABLE "favorite_salons"`);
    }

}
