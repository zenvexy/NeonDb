const disponibilidade = (req, res) => {
    res.status(200).json(["SIM", "NAO"]);
};

module.exports = {
    disponibilidade
};
