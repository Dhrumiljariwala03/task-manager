const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/TMS').then(() => {
    console.log('Database Connected!')
}).catch((error) => console.log('Database Not Connected!', error.messsage))