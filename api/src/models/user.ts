import mongoose from "mongoose";
import { Password } from "../services/password";

interface UserAttrs {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

interface UserDoc extends mongoose.Document {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
} 

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs) : UserDoc;
}

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
});

userSchema.pre("save", async function(done) {
    if(this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };