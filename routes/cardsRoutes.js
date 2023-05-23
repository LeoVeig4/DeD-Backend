const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');


const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido' });
    }
  
    try {
      const decodedToken = jwt.verify(token, process.env.salt);
      const userId = decodedToken.userId;
  
      User.findById(userId, (err, user) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Erro ao verificar a autenticação do usuário' });
        }
  
        if (!user) {
          return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        if (user.id !== req.params.userId) {
          return res.status(403).json({ message: 'Acesso negado' });
        }
        next();
      });
    } catch (err) {
      // O token é inválido ou expirou
      return res.status(401).json({ message: 'Token de autenticação inválido' });
    }
  };
  

router.get("/:id",async (req,res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }

    return res.status(200).json(user.cards)
})

router.post("/:id",authenticateUser ,async(req,res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    const {card,type} = req.body;
    user.cards[type].push(card);

    return res.status(200).json({message:"Carta adicionada"});
})

module.exports = router;