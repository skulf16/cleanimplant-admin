-- AlterTable
ALTER TABLE "DentistProfile" ADD COLUMN     "appointmentUrl" TEXT,
ADD COLUMN     "galleryImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "googleBusinessUrl" TEXT,
ADD COLUMN     "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "treatments" TEXT[] DEFAULT ARRAY[]::TEXT[];
