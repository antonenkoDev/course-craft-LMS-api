import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStudentAndEnrollment1716731248220 implements MigrationInterface {
    name = 'CreateStudentAndEnrollment1716731248220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lesson" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "number" integer NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "text" text NOT NULL, "video_link" text array NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "course_uuid" uuid, CONSTRAINT "PK_d6c334a318d15d1d58ee0c3a013" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "student" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, CONSTRAINT "PK_e11fbd60aaa3196597d36f2bbfb" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "course" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b96e908701cd50e8a5f13f49956" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "worker" ("uuid" SERIAL NOT NULL, "user_id" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "role" character varying NOT NULL, CONSTRAINT "PK_52e67de404e8f86a670a5ba9359" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "organization" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "label" character varying NOT NULL, "name" character varying NOT NULL, "database_name" character varying NOT NULL, "auth0_organization_id" character varying NOT NULL, CONSTRAINT "UQ_a204814e044ef4b6f520b403739" UNIQUE ("label"), CONSTRAINT "UQ_c21e615583a3ebbb0977452afb0" UNIQUE ("name"), CONSTRAINT "UQ_59c3327f3fc33d35bda5e8f5e92" UNIQUE ("database_name"), CONSTRAINT "UQ_3ca2d5fa87ad19226a04f33f9c0" UNIQUE ("auth0_organization_id"), CONSTRAINT "PK_59f940b5775a9ccf5c2f094c8af" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "user" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "auth0_id" character varying, "is_active" boolean, "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying, "phone" character varying, "birthdate" date, "gender" integer, "timezone" character varying, CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "enrollment" ("uuid" SERIAL NOT NULL, "enrollment_date" TIMESTAMP NOT NULL DEFAULT now(), "expiry_date" TIMESTAMP NOT NULL, "student_uuid" uuid, "course_uuid" uuid, CONSTRAINT "PK_836fe57ff0688389ab52000ab0e" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "student_courses_course" ("student_uuid" uuid NOT NULL, "course_uuid" uuid NOT NULL, CONSTRAINT "PK_8ea638ae4eecf054d71b2e72db4" PRIMARY KEY ("student_uuid", "course_uuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c0e25ea3b882d8cc5f13bff80f" ON "student_courses_course" ("student_uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_9404fcf393b90273691a82f45a" ON "student_courses_course" ("course_uuid") `);
        await queryRunner.query(`CREATE TABLE "user_organizations_organization" ("user_uuid" uuid NOT NULL, "organization_uuid" uuid NOT NULL, CONSTRAINT "PK_b0b228e1ed80cbee5cce2e6baf8" PRIMARY KEY ("user_uuid", "organization_uuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_04574f5bb65cb0c6a013216129" ON "user_organizations_organization" ("user_uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_b9dd1cfbea03e162d0f407b962" ON "user_organizations_organization" ("organization_uuid") `);
        await queryRunner.query(`ALTER TABLE "lesson" ADD CONSTRAINT "FK_37be26e2300d5f41870e6aa2d55" FOREIGN KEY ("course_uuid") REFERENCES "course"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollment" ADD CONSTRAINT "FK_dc41a78696589c027e2f5441236" FOREIGN KEY ("student_uuid") REFERENCES "student"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollment" ADD CONSTRAINT "FK_47089fedbf2bb95ab76fd3288bf" FOREIGN KEY ("course_uuid") REFERENCES "course"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_courses_course" ADD CONSTRAINT "FK_c0e25ea3b882d8cc5f13bff80f1" FOREIGN KEY ("student_uuid") REFERENCES "student"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "student_courses_course" ADD CONSTRAINT "FK_9404fcf393b90273691a82f45a6" FOREIGN KEY ("course_uuid") REFERENCES "course"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_organizations_organization" ADD CONSTRAINT "FK_04574f5bb65cb0c6a013216129d" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_organizations_organization" ADD CONSTRAINT "FK_b9dd1cfbea03e162d0f407b9629" FOREIGN KEY ("organization_uuid") REFERENCES "organization"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_organizations_organization" DROP CONSTRAINT "FK_b9dd1cfbea03e162d0f407b9629"`);
        await queryRunner.query(`ALTER TABLE "user_organizations_organization" DROP CONSTRAINT "FK_04574f5bb65cb0c6a013216129d"`);
        await queryRunner.query(`ALTER TABLE "student_courses_course" DROP CONSTRAINT "FK_9404fcf393b90273691a82f45a6"`);
        await queryRunner.query(`ALTER TABLE "student_courses_course" DROP CONSTRAINT "FK_c0e25ea3b882d8cc5f13bff80f1"`);
        await queryRunner.query(`ALTER TABLE "enrollment" DROP CONSTRAINT "FK_47089fedbf2bb95ab76fd3288bf"`);
        await queryRunner.query(`ALTER TABLE "enrollment" DROP CONSTRAINT "FK_dc41a78696589c027e2f5441236"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP CONSTRAINT "FK_37be26e2300d5f41870e6aa2d55"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b9dd1cfbea03e162d0f407b962"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_04574f5bb65cb0c6a013216129"`);
        await queryRunner.query(`DROP TABLE "user_organizations_organization"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9404fcf393b90273691a82f45a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c0e25ea3b882d8cc5f13bff80f"`);
        await queryRunner.query(`DROP TABLE "student_courses_course"`);
        await queryRunner.query(`DROP TABLE "enrollment"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "organization"`);
        await queryRunner.query(`DROP TABLE "worker"`);
        await queryRunner.query(`DROP TABLE "course"`);
        await queryRunner.query(`DROP TABLE "student"`);
        await queryRunner.query(`DROP TABLE "lesson"`);
    }

}
