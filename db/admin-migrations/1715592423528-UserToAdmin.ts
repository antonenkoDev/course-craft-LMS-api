import { MigrationInterface, QueryRunner } from "typeorm";

export class UserToAdmin1715592423528 implements MigrationInterface {
    name = 'UserToAdmin1715592423528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" RENAME COLUMN "customer_id" TO "label"`);
        await queryRunner.query(`ALTER TABLE "organization" RENAME CONSTRAINT "UQ_401a0707e77c808ea0c641bc9a8" TO "UQ_a204814e044ef4b6f520b403739"`);
        await queryRunner.query(`CREATE TABLE "user" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "auth0_id" character varying, "is_active" boolean, "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying, "phone" character varying, "birthdate" date, "gender" integer, "timezone" character varying, CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "user_organizations_organization" ("user_uuid" uuid NOT NULL, "organization_uuid" uuid NOT NULL, CONSTRAINT "PK_b0b228e1ed80cbee5cce2e6baf8" PRIMARY KEY ("user_uuid", "organization_uuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_04574f5bb65cb0c6a013216129" ON "user_organizations_organization" ("user_uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_b9dd1cfbea03e162d0f407b962" ON "user_organizations_organization" ("organization_uuid") `);
        await queryRunner.query(`ALTER TABLE "user_organizations_organization" ADD CONSTRAINT "FK_04574f5bb65cb0c6a013216129d" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_organizations_organization" ADD CONSTRAINT "FK_b9dd1cfbea03e162d0f407b9629" FOREIGN KEY ("organization_uuid") REFERENCES "organization"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_organizations_organization" DROP CONSTRAINT "FK_b9dd1cfbea03e162d0f407b9629"`);
        await queryRunner.query(`ALTER TABLE "user_organizations_organization" DROP CONSTRAINT "FK_04574f5bb65cb0c6a013216129d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b9dd1cfbea03e162d0f407b962"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_04574f5bb65cb0c6a013216129"`);
        await queryRunner.query(`DROP TABLE "user_organizations_organization"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "organization" RENAME CONSTRAINT "UQ_a204814e044ef4b6f520b403739" TO "UQ_401a0707e77c808ea0c641bc9a8"`);
        await queryRunner.query(`ALTER TABLE "organization" RENAME COLUMN "label" TO "customer_id"`);
    }

}
