-- AlterTable
ALTER TABLE "ReviewSubmission" ADD COLUMN "ipCity" TEXT;
ALTER TABLE "ReviewSubmission" ADD COLUMN "ipCountry" TEXT;
ALTER TABLE "ReviewSubmission" ADD COLUMN "ipDistrict" TEXT;
ALTER TABLE "ReviewSubmission" ADD COLUMN "ipRegion" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RewardGiven" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submissionId" TEXT NOT NULL,
    "rewardId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RewardGiven_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ReviewSubmission" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RewardGiven_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Reward" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RewardGiven_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RewardGiven" ("branchId", "brandId", "createdAt", "customerName", "id", "rewardId", "submissionId") SELECT "branchId", "brandId", "createdAt", "customerName", "id", "rewardId", "submissionId" FROM "RewardGiven";
DROP TABLE "RewardGiven";
ALTER TABLE "new_RewardGiven" RENAME TO "RewardGiven";
CREATE UNIQUE INDEX "RewardGiven_submissionId_key" ON "RewardGiven"("submissionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
