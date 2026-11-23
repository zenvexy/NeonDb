const prisma = require("../data/prisma");

const listar = async (req, res) => {
    const lista = await prisma.esfiha.findMany({
        include: {
            categoria: true
        }
    });

    res.status(200).json(lista);
};

const cadastrar = async (req, res) => {
    const item = await prisma.esfiha.create({
        data: req.body
    });

    res.status(201).json(item);
};

const atualizar = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.esfiha.update({
        where: { id: Number(id) },
        data: req.body
    });

    res.status(200).json(item);
};

const excluir = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.esfiha.delete({
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
