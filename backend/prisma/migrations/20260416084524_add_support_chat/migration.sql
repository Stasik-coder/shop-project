-- CreateEnum
CREATE TYPE "SupportChatStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateTable
CREATE TABLE "SupportChat" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "SupportChatStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportMessage" (
    "id" SERIAL NOT NULL,
    "chatId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SupportChat_userId_idx" ON "SupportChat"("userId");

-- CreateIndex
CREATE INDEX "SupportMessage_chatId_idx" ON "SupportMessage"("chatId");

-- CreateIndex
CREATE INDEX "SupportMessage_senderId_idx" ON "SupportMessage"("senderId");

-- AddForeignKey
ALTER TABLE "SupportChat" ADD CONSTRAINT "SupportChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportMessage" ADD CONSTRAINT "SupportMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "SupportChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportMessage" ADD CONSTRAINT "SupportMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
