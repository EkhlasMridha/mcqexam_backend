import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import {genSalt,hash,compare} from "bcrypt";

@Injectable()
export class BcryptProvider implements HashingProvider {
    async hashPassword(data: string | Buffer): Promise<string> {
        const salt = await genSalt();
        return hash(data,salt);
    }
    async comparePassword(data: string | Buffer,encrypted:string): Promise<boolean> {
        return await compare(data,encrypted);
    }
}
