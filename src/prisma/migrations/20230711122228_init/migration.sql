/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Proxy" (
    "id" UUID NOT NULL,
    "ip" VARCHAR(15) NOT NULL,
    "port" VARCHAR(15) NOT NULL,
    "login" VARCHAR(50) NOT NULL,
    "password" VARCHAR(50) NOT NULL,

    CONSTRAINT "Proxy_pkey" PRIMARY KEY ("id")
);
