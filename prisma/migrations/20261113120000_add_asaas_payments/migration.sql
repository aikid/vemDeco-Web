ALTER TABLE "checkout_orders"
  ADD COLUMN "payment_provider" VARCHAR(30),
  ADD COLUMN "payment_method" VARCHAR(30),
  ADD COLUMN "payment_status" VARCHAR(40),
  ADD COLUMN "payment_external_id" VARCHAR(80),
  ADD COLUMN "payment_url" VARCHAR(1000),
  ADD COLUMN "payment_due_date" DATE,
  ADD COLUMN "payment_confirmed_at" TIMESTAMPTZ(3);

CREATE UNIQUE INDEX "checkout_orders_payment_external_id_key" ON "checkout_orders"("payment_external_id");

CREATE TABLE "payment_webhook_events" (
  "id" VARCHAR(120) NOT NULL,
  "provider" VARCHAR(30) NOT NULL,
  "event_type" VARCHAR(80) NOT NULL,
  "payment_id" VARCHAR(80),
  "payload" JSONB NOT NULL,
  "processed_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "payment_webhook_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "payment_webhook_events_provider_payment_id_idx"
  ON "payment_webhook_events"("provider", "payment_id");
