
import mongoose from 'mongoose'
import { app } from './app';
const start = async() => {
    if(!process.env.JWT_KEY) {
        throw new Error('jwt must be defined')
    }if(!process.env.MONGO_URI) {
        throw new Error('MONGO DB must be defined')
    }
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
    } catch (error) {
        console.error(error)
    }
    app.listen(3000, ()=> {
        console.log('listen por 3000 authService')
    })

}

start();