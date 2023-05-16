const router = require('express').Router()
const User = require('../Models/User')


//create
router.post('/', async (req, res) => {

    const { name, email, password } = req.body
    if (!name || !email || !password) {
        res.status(422).json({ message: 'Corpo de requisição errado! (name, email, password)' })
        return
    }

    const newUser = {
        name, email, password
    }
    try {
        await User.create(newUser)
        res.status(201).json({ message: 'User cadastrado com sucesso' })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e })
    }
})

//index
router.get('/', async (req, res) => {
    try {

        const users = await User.find()

        res.status(200).json(users)
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e })
    }
})

//show
router.get('/:id', async (req, res) => {
    try {

        const user = await User.findOne({ _id: req.params.id })

        if (!user) {
            res.status(422).json({ message: 'O usuário não foi encontrado!' })
            return
        }

        res.status(200).json(user)
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e })
    }
})

//update (PUT) (PATCH)
router.put('/:id', async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        res.status(422).json({ message: 'Corpo de requisição errado! (name, email, password)' })
        return
    }
    const user = {
        name, email, password
    }
    try {

        const updateUser = await User.updateOne({ _id: req.params.id }, user)
        if (!updateUser) {
            res.status(422).json({ message: 'O usuário não foi encontrado!' })
            return
        }

        if (updateUser.matchedCount === 0) {
            res.status(422).json({ message: 'O usuário não foi encontrado!' })
            return
        }

        res.status(200).json(user)
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e })
    }
})

//delete
router.delete('/:id', async (req, res) => {

    const user = await User.findOne({ _id: req.params.id })
    if (!user) {
        res.status(422).json({ message: 'O usuário não foi encontrado!' })
        return
    }

    try {

        await User.deleteOne({ _id: req.params.id })
        res.status(200).json({ message: "Usuário removido com sucesso" })

    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e })
    }
})

module.exports = router