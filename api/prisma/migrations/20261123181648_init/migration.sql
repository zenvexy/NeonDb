-- CreateEnum
CREATE TYPE "Disponibilidade" AS ENUM ('DISPONIVEL', 'INDISPONIVEL');

-- CreateTable
CREATE TABLE "Esfiha" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "disponivel" "Disponibilidade" NOT NULL DEFAULT 'DISPONIVEL',
    "categoriaId" INTEGER NOT NULL,

    CONSTRAINT "Esfiha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nome_key" ON "Categoria"("nome");

-- AddForeignKey
ALTER TABLE "Esfiha" ADD CONSTRAINT "Esfiha_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
