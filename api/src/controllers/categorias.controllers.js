const prisma = require("../data/prisma");

const listar = async (req, res) => {

    const lista = await prisma.categoria.findMany({
        include: { esfihas: true }
    });

    res.status(200).json(lista);
};

const cadastrar = async (req, res) => {

    const existe = await prisma.categoria.findFirst({
        where: { nome: req.body.nome }
    });

    if (existe) {
        return res.status(409).json({ message: "Essa categoria já existe." });
    }

    const item = await prisma.categoria.create({
        data: req.body
    });

    res.status(201).json(item);
};

const atualizar = async (req, res) => {

    const { id } = req.params;

    const existe = await prisma.categoria.findFirst({
        where: {
            nome: req.body.nome,
            id: { not: Number(id) }
        }
    });

    if (existe) {
        return res.status(409).json({ message: "Essa categoria já existe." });
    }

    const item = await prisma.categoria.update({
        where: { id: Number(id) },
        data: req.body
    });

    res.status(200).json(item);
};

const excluir = async (req, res) => {

    const { id } = req.params;

    const item = await prisma.categoria.delete({
        where: { id: Number(id) }
    });

    res.status(200).json(item);
};

module.exports = {
    listar,
    cadastrar,
    atualizar,
    excluir
};