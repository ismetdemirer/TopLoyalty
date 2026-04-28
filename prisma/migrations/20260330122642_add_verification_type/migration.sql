-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Branch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brandId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "googleMapsCID" TEXT NOT NULL,
    "placeId" TEXT,
    "reviewUrl" TEXT NOT NULL,
    "mapsUrl" TEXT NOT NULL,
    "qrImagePath" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "verificationType" TEXT NOT NULL DEFAULT 'MAPS',
    "instagramLocationTag" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Branch_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Branch" ("active", "brandId", "createdAt", "googleMapsCID", "id", "mapsUrl", "name", "placeId", "qrImagePath", "reviewUrl") SELECT "active", "brandId", "createdAt", "googleMapsCID", "id", "mapsUrl", "name", "placeId", "qrImagePath", "reviewUrl" FROM "Branch";
DROP TABLE "Branch";
ALTER TABLE "new_Branch" RENAME TO "Branch";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
