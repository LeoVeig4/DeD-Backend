const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../Models/User.js');


const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SALT);
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


router.get("/", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido' });
  }

  const decodedToken = jwt.verify(token, process.env.SALT);
  const id = decodedToken.userId;

  const user = await User.findById(id);
  if (!user) {
    return res.status(401).json({ message: 'Usuário não encontrado' });
  }

  return res.status(200).json(user.cards)
})

router.post("/", authenticateUser, async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido' });
  }

  const { card, type } = req.body;

  if (!['spells', 'monsters', 'classes'].includes(type)) {
    return res.status(400).json({ message: "Tipo inválido" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SALT);
    const id = decodedToken.userId;

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


router.delete("/:type/:index", authenticateUser, async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido' });
  }
  const { index, type } = req.params;
  if (!['spells', 'monsters', 'classes'].includes(type)) {
    return res.status(400).json({ message: "Tipo inválido" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SALT);
    const id = decodedToken.userId;

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