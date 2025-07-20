import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAllTables1753038180809 implements MigrationInterface {
    name = 'CreateAllTables1753038180809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "description" text, "price" numeric(10,2) NOT NULL DEFAULT '0', "stock_quantity" integer NOT NULL DEFAULT '0', "sold_quantity" integer, "view_count" integer NOT NULL DEFAULT '0', "available_colors" text NOT NULL DEFAULT '[]', "image_gallery" text NOT NULL DEFAULT '[]', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_22cc43e9a74d7498546e9a63e7" ON "product" ("name") `);
        await queryRunner.query(`CREATE TYPE "public"."file_upload_filetype_enum" AS ENUM('image', 'document', 'archive', 'video', 'audio', 'other')`);
        await queryRunner.query(`CREATE TYPE "public"."file_upload_storageprovider_enum" AS ENUM('local', 's3', 'cloudinary')`);
        await queryRunner.query(`CREATE TABLE "file_upload" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "originalName" character varying(255) NOT NULL, "filename" character varying(255) NOT NULL, "path" character varying(255) NOT NULL, "mimetype" character varying(100) NOT NULL, "size" bigint NOT NULL, "extension" character varying(10) NOT NULL, "fileType" "public"."file_upload_filetype_enum" NOT NULL DEFAULT 'other', "isPublic" boolean NOT NULL DEFAULT false, "url" character varying(255), "storageProvider" "public"."file_upload_storageprovider_enum" NOT NULL DEFAULT 'local', "storageMeta" json, "uploadedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_bb8460e39fcad3aaa44d1d7e5d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid, "file_id" uuid, "role" character varying(50), "isFavorite" boolean NOT NULL DEFAULT false, "meta" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_1c5450fc1c3ea58bd31e21a1475" UNIQUE ("user_id", "file_id"), CONSTRAINT "PK_c6771f226a8149de690641d11ae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "app_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(30) NOT NULL, "email" character varying(30) NOT NULL, "password" character varying(255) NOT NULL, "phone" character varying(20), "address" character varying(500), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_3fa909d0e37c531ebc237703391" UNIQUE ("email"), CONSTRAINT "PK_22a5c4a3d9b2fb8e4e73fc4ada1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3fa909d0e37c531ebc23770339" ON "app_user" ("email") `);
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(20) NOT NULL, "description" character varying(100) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ae4578dcaed5adff96595e6166" ON "role" ("name") `);
        await queryRunner.query(`CREATE TABLE "user_role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "role_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_fb2e442d14add3cefbdf33c4561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_USER_ROLE_COMPOSITE" ON "user_role" ("user_id", "role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_USER_ROLE_ROLE_ID" ON "user_role" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_USER_ROLE_USER_ID" ON "user_role" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(20) NOT NULL, "description" character varying(20), "image" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_file" ADD CONSTRAINT "FK_68c8585dbb7655a45a3df93f412" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_file" ADD CONSTRAINT "FK_572508958a5c97a2f44a4f2c64b" FOREIGN KEY ("file_id") REFERENCES "file_upload"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_d0e5815877f7395a198a4cb0a46" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_32a6fc2fcb019d8e3a8ace0f55f" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_32a6fc2fcb019d8e3a8ace0f55f"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_d0e5815877f7395a198a4cb0a46"`);
        await queryRunner.query(`ALTER TABLE "user_file" DROP CONSTRAINT "FK_572508958a5c97a2f44a4f2c64b"`);
        await queryRunner.query(`ALTER TABLE "user_file" DROP CONSTRAINT "FK_68c8585dbb7655a45a3df93f412"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_USER_ROLE_USER_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_USER_ROLE_ROLE_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_USER_ROLE_COMPOSITE"`);
        await queryRunner.query(`DROP TABLE "user_role"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ae4578dcaed5adff96595e6166"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3fa909d0e37c531ebc23770339"`);
        await queryRunner.query(`DROP TABLE "app_user"`);
        await queryRunner.query(`DROP TABLE "user_file"`);
        await queryRunner.query(`DROP TABLE "file_upload"`);
        await queryRunner.query(`DROP TYPE "public"."file_upload_storageprovider_enum"`);
        await queryRunner.query(`DROP TYPE "public"."file_upload_filetype_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_22cc43e9a74d7498546e9a63e7"`);
        await queryRunner.query(`DROP TABLE "product"`);
    }

}
