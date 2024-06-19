import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";

const sryptAsync = promisify(scrypt);

export class Password {
    static async toHash(password: string){
        const salt = randomBytes(8).toString('hex');
        const buf = (await sryptAsync(password, salt, 64)) as Buffer;

        return `${buf.toString('hex')}.${salt}`
    }

    static async compare(storedPassword:string, suppliedPassword: string){
        const [hashedPassword, salt] = storedPassword.split('.');

        const buf = (await sryptAsync(suppliedPassword, salt, 64)) as Buffer;

        return buf.toString('hex') === hashedPassword;
    }
}