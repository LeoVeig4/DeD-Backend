const express = require('express');
const router = express.Router();
const User = require('../models/User.js');

// Rota para criar um novo usuário
router.post('/', async (req, res) => {
    console.log(req.body);
  try {
    const { email, name, password, cards } = req.body;
    const user = new User({ email, name, password,cards });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Rota para obter todos os usuários
router.get('/', async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter os usuários' });
  }
});

// Rota para obter um usuário pelo ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter o usuário' });
  }
});

// Rota para atualizar um usuário pelo ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, password } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    user.email = email;
    user.name = name;
    user.password = password;

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o usuário' });
  }
});

// Rota para excluir um usuário pelo ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndRemove(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ message: 'Usuário removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir o usuário' });
  }
});

module.exports = router;