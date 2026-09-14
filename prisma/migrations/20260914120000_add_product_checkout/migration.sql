-- CreateEnum
CREATE TYPE "CheckoutStatus" AS ENUM ('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED');

-- CreateTable
CREATE TABLE "product_details" (
    "id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "condition" VARCHAR(30) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 1,
    "delivery_details" VARCHAR(180),
    CONSTRAINT "product_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkout_orders" (
    "id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "buyer_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(14,2) NOT NULL,
    "total" DECIMAL(14,2) NOT NULL,
    "status" "CheckoutStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "recipient_name" VARCHAR(120) NOT NULL,
    "phone" VARCHAR(30) NOT NULL,
    "address_line" VARCHAR(180) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" CHAR(2) NOT NULL,
    "postal_code" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "checkout_orders_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "product_details_listing_id_key" ON "product_details"("listing_id");
CREATE INDEX "product_details_stock_idx" ON "product_details"("stock");
CREATE INDEX "checkout_orders_buyer_id_created_at_idx" ON "checkout_orders"("buyer_id", "created_at" DESC);
CREATE INDEX "checkout_orders_listing_id_status_idx" ON "checkout_orders"("listing_id", "status");

ALTER TABLE "product_details" ADD CONSTRAINT "product_details_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "checkout_orders" ADD CONSTRAINT "checkout_orders_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "checkout_orders" ADD CONSTRAINT "checkout_orders_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "product_details" ADD CONSTRAINT "product_details_stock_non_negative" CHECK ("stock" >= 0);
ALTER TABLE "checkout_orders" ADD CONSTRAINT "checkout_orders_quantity_positive" CHECK ("quantity" > 0);
ALTER TABLE "checkout_orders" ADD CONSTRAINT "checkout_orders_totals_non_negative" CHECK ("unit_price" >= 0 AND "total" >= 0);
ALTER TABLE "checkout_orders" ADD CONSTRAINT "checkout_orders_state_length" CHECK (char_length("state") = 2);
