/*
  Warnings:

  - Added the required column `image_url` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "image_url" TEXT NOT NULL;
