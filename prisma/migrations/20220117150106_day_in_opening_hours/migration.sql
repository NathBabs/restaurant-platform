/*
  Warnings:

  - Added the required column `day` to the `opening_hours` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "opening_hours" ADD COLUMN     "day" TEXT NOT NULL;
