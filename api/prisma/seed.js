require("dotenv").config();

const prisma = require("../src/data/prisma");

async function main() {
    await prisma.$transaction(async (transaction) => {
        await transaction.esfiha.deleteMany();
        await transaction.categoria.deleteMany();

        const categorias = await Promise.all([
            transaction.categoria.create({
                data: { nome: "Tradicionais" }
            }),
            transaction.categoria.create({
                data: { nome: "Especiais" }
            }),
            transaction.categoria.create({ data: { nome: "Doces" } })
        ]);
        console.log("Categorias de teste cadastradas.");

        await Promise.all([
            transaction.esfiha.create({
                data: {
                    nome: "Carne",
                    preco: 8.5,
                    categoria: {
                        connect: { id: categorias[0].id }
                    }
                }
            }),
            transaction.esfiha.create({
                data: {
                    nome: "Frango com Catupiry",
                    preco: 10,
                    categoria: {
                        connect: { id: categorias[1].id }
                    }
                }
            }),
            transaction.esfiha.create({
                data: {
                    nome: "Chocolate",
                    preco: 9,
                    categoria: {
                        connect: { id: categorias[2].id }
                    }
                }
            })
        ]);
        console.log("Esfihas de teste cadastradas.");
    });
}

main()
    .catch((erro) => {
        console.error(erro);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
