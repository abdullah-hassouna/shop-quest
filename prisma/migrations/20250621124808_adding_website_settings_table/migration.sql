-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT DEFAULT 'ShopQuest',
    "slug" TEXT DEFAULT 'website-slug',
    "metadata" TEXT DEFAULT '{}',
    "logoDark" TEXT DEFAULT '',
    "logoLight" TEXT DEFAULT '',
    "favicon" TEXT DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
