const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');


const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.salt);
    const userId = decodedToken.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao verificar a autenticação do usuário' });
  }

};


router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(401).json({ message: 'Usuário não encontrado' });
  }

  return res.status(200).json(user.cards)
})

router.post("/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;

  const { card, type } = req.body;

  if (!['spells', 'monsters', 'classes'].includes(type)) {
    return res.status(400).json({ message: "Tipo inválido" });
  }

  try {
    const user = await User.findByIdAndUpdate(id,
      { $set: { [`cards.${type}.${card.index}`]: card } },
      { new: true }
    );

    if (!user) {
      return res.status(401).json({ message: "Erro ao adicionar carta" });
    }
    await user.save();
    return res.status(200).json({ message: "Carta adicionada" });

  } catch (err) {
    return res.status(401).json({ message: "Erro ao adicionar cartas" });
  }

});


router.delete("/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { index, type } = req.body;

  if (!['spells', 'monsters', 'classes'].includes(type)) {
    return res.status(400).json({ message: "Tipo inválido" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $unset: { [`cards.${type}.${index}`]: "" } },
      { new: true }
    );

    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    await user.save();

    return res.status(200).json({ message: "Carta deletada" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao deletar carta" });
  }
});

module.exports = router;