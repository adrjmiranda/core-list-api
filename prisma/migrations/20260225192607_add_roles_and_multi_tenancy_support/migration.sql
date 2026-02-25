-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER', 'MANAGER');

-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "tenant_id" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER',
ADD COLUMN     "tenant_id" TEXT;
