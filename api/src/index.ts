import moongose from 'mongoose';
import { app } from './app';

const start = async() => {
    if(!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined");
    }

    if(!process.env.MONGO_URI){
        throw new Error('MONGO_URI must be defined.')
    }

    try{
        await moongose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB')
    }
    catch (err) {
        console.log(err)
    }

    app.listen(3002, () => {
        console.log('Listening on port 3002!')
    });
}

start();