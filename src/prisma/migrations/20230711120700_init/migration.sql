-- CreateTable
CREATE TABLE "Post" (
    "id" UUID NOT NULL,
    "ip" VARCHAR(15) NOT NULL,
    "port" VARCHAR(15) NOT NULL,
    "login" VARCHAR(50) NOT NULL,
    "password" VARCHAR(50) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);
