-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('EUR', 'USD');

-- CreateTable
CREATE TABLE "Home" (
    "id" SERIAL NOT NULL,
    "homeName" TEXT NOT NULL,
    "homeAddress" TEXT NOT NULL,
    "homeCurrency" "Currency" NOT NULL,

    CONSTRAINT "Home_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" BIGINT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "username" TEXT,
    "language_code" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeUser" (
    "id" SERIAL NOT NULL,
    "homeId" INTEGER NOT NULL,
    "userId" BIGINT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',

    CONSTRAINT "HomeUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HomeUser_homeId_userId_key" ON "HomeUser"("homeId", "userId");

-- AddForeignKey
ALTER TABLE "HomeUser" ADD CONSTRAINT "HomeUser_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeUser" ADD CONSTRAINT "HomeUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
