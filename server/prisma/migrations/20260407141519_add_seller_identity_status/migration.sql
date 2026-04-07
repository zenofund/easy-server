-- CreateEnum
CREATE TYPE "IdentityStatus" AS ENUM ('UNVERIFIED', 'PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "SellerProfile" ADD COLUMN     "identityStatus" "IdentityStatus" NOT NULL DEFAULT 'UNVERIFIED',
ADD COLUMN     "rejectionReason" TEXT;
