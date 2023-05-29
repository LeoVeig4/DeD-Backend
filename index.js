//config inicial
const express = require('express')
const cors = require('cors');
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

app.use(cors({
    origin: '*',
    exposedHeaders: 'Authorization', // Allow the 'Authorization' header
}));

//rotas
const userRoutes = require('./routes/userRoutes')
const authRoutes = require("./routes/authRoutes")
const cardsRoutes = require("./routes/cardsRoutes")
app.use('/users', userRoutes)
app.use('/auth', authRoutes)
app.use("/cards", cardsRoutes)

// rota inicial / endpoint
app.get('/', (req, res) => {
    res.json({ message: "Hello World" })
})
//
//entregar uma porta
app.listen(process.env.PORT);
// mongoose.connect(`${process.env.CONNECT_MONGO_URL}`)

//     .then(() => {
//         console.log('Conectado ao mongoDB')

//     }).catch((err) => console.log(err))
