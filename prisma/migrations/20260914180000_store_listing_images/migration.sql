ALTER TABLE "listing_images"
ADD COLUMN "data" BYTEA,
ADD COLUMN "mime_type" VARCHAR(50);

ALTER TABLE "listing_images" ADD CONSTRAINT "listing_images_source_present" CHECK (
  "public_url" IS NOT NULL OR "data" IS NOT NULL
);
