//config inicial
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config();

const app = express()

const User = require('./Models/User')

//forma de ler JSON /middleware
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

//rotas

app.post('/user', async (req, res) => {

    const { name, email, password } = req.body
    if (!name || !email || !password) res.status(422).json({ message: 'Corpo de requisição errado! (name, email, password)' })
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

// rota inicial / endpoint
app.get('/', (req, res) => {
    res.json({ message: "Hello World" })
})
//
//entregar uma porta
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster-test.0qznri4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(() => {
        console.log('Conectado ao mongoDB')
        app.listen(3000)
    }).catch((err) => console.log(err))
