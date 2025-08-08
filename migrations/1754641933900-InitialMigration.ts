import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1754641933900 implements MigrationInterface {
    name = 'InitialMigration1754641933900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying(20) NOT NULL, "description" character varying(100) NOT NULL, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ae4578dcaed5adff96595e6166" ON "role" ("name") `);
        await queryRunner.query(`CREATE TABLE "app_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_9b97e4fbff9c2f3918fda27f999" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_USER_ROLE_COMPOSITE" ON "app_users" ("user_id", "role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_USER_ROLE_ROLE_ID" ON "app_users" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_USER_ROLE_USER_ID" ON "app_users" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying(30) NOT NULL, "email" character varying(30) NOT NULL, "password" character varying(30) NOT NULL, "phone" character varying(20), "address" character varying(500), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`ALTER TABLE "app_users" ADD CONSTRAINT "FK_1c9491ba157e3501f828d224706" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "app_users" ADD CONSTRAINT "FK_dd1da3d9d8c6997594c70ecaaff" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_users" DROP CONSTRAINT "FK_dd1da3d9d8c6997594c70ecaaff"`);
        await queryRunner.query(`ALTER TABLE "app_users" DROP CONSTRAINT "FK_1c9491ba157e3501f828d224706"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_USER_ROLE_USER_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_USER_ROLE_ROLE_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_USER_ROLE_COMPOSITE"`);
        await queryRunner.query(`DROP TABLE "app_users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ae4578dcaed5adff96595e6166"`);
        await queryRunner.query(`DROP TABLE "role"`);
    }

}
