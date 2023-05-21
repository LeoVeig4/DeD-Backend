//config inicial
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config();

const app = express()

//forma de ler JSON /middleware
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

//rotas
const userRoutes = require('./routes/userRoutes')
const authRoutes = require("./routes/authRoutes")
app.use('/users', userRoutes)
app.use('/auth', authRoutes)

// rota inicial / endpoint
app.get('/', (req, res) => {
    res.json({ message: "Hello World" })
})
//
//entregar uma porta
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.8sm8kka.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(() => {
        console.log('Conectado ao mongoDB')
        app.listen(3000)
    }).catch((err) => console.log(err))
