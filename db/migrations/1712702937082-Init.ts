import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1712702937082 implements MigrationInterface {
    name = 'Init1712702937082'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organization" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_id" character varying NOT NULL, "name" character varying NOT NULL, "database_name" character varying NOT NULL, "auth0_organization_id" character varying NOT NULL, CONSTRAINT "UQ_401a0707e77c808ea0c641bc9a8" UNIQUE ("customer_id"), CONSTRAINT "UQ_c21e615583a3ebbb0977452afb0" UNIQUE ("name"), CONSTRAINT "UQ_59c3327f3fc33d35bda5e8f5e92" UNIQUE ("database_name"), CONSTRAINT "UQ_3ca2d5fa87ad19226a04f33f9c0" UNIQUE ("auth0_organization_id"), CONSTRAINT "PK_59f940b5775a9ccf5c2f094c8af" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "lesson" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "number" integer NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "text" text NOT NULL, "video_link" text array NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "course_uuid" uuid, CONSTRAINT "PK_d6c334a318d15d1d58ee0c3a013" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "tag" ("uuid" SERIAL NOT NULL, CONSTRAINT "PK_d70de2c1e1a3b52adb904028ea2" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "user" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "idp_id" character varying, "is_active" boolean, "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying, "phone" character varying, "birthdate" date, "gender" integer, "first_day" date, "last_day" date, "timezone" character varying, "work_mode" integer, CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "course" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_uuid" uuid, CONSTRAINT "PK_b96e908701cd50e8a5f13f49956" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "tag_users_user" ("tag_uuid" integer NOT NULL, "user_uuid" uuid NOT NULL, CONSTRAINT "PK_98c77c54c2c818674c3f571df71" PRIMARY KEY ("tag_uuid", "user_uuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_75757524d5e4d84561a4cf6702" ON "tag_users_user" ("tag_uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_a928f4fa7bcfb0b6cbd207b5b7" ON "tag_users_user" ("user_uuid") `);
        await queryRunner.query(`ALTER TABLE "lesson" ADD CONSTRAINT "FK_37be26e2300d5f41870e6aa2d55" FOREIGN KEY ("course_uuid") REFERENCES "course"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course" ADD CONSTRAINT "FK_cfcfe1a870932b57905476158b0" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tag_users_user" ADD CONSTRAINT "FK_75757524d5e4d84561a4cf67029" FOREIGN KEY ("tag_uuid") REFERENCES "tag"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tag_users_user" ADD CONSTRAINT "FK_a928f4fa7bcfb0b6cbd207b5b70" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag_users_user" DROP CONSTRAINT "FK_a928f4fa7bcfb0b6cbd207b5b70"`);
        await queryRunner.query(`ALTER TABLE "tag_users_user" DROP CONSTRAINT "FK_75757524d5e4d84561a4cf67029"`);
        await queryRunner.query(`ALTER TABLE "course" DROP CONSTRAINT "FK_cfcfe1a870932b57905476158b0"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP CONSTRAINT "FK_37be26e2300d5f41870e6aa2d55"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a928f4fa7bcfb0b6cbd207b5b7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_75757524d5e4d84561a4cf6702"`);
        await queryRunner.query(`DROP TABLE "tag_users_user"`);
        await queryRunner.query(`DROP TABLE "course"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "lesson"`);
        await queryRunner.query(`DROP TABLE "organization"`);
    }

}
