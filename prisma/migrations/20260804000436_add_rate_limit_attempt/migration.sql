-- CreateTable
CREATE TABLE "RateLimitAttempt" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateLimitAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RateLimitAttempt_key_key" ON "RateLimitAttempt"("key");

-- CreateIndex
CREATE INDEX "RateLimitAttempt_expiresAt_idx" ON "RateLimitAttempt"("expiresAt");
