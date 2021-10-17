import * as crypto from 'crypto';
import { createHmac } from 'crypto';
import { Response } from 'express';
import { sign, SignOptions, verify } from 'jsonwebtoken';
import { Field, ObjectType } from 'type-graphql';
import { User } from '../entities/User';

const ENCRYPTION_ALGORITHM = 'aes-256-ctr';
const PASSWORD_HASH_ALGORITHM = "sha512"

export const SECRET_CHARS = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()[]{}/+-_:.;,£àÀÉéÈè°ç\"<>`?'´=¬|¢~ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export enum JwtType {
    ACCESS_TOKEN = "access-token",
    REFRESH_TOKEN = "refresh-token",
    API_KEY = "api-key"
}

@ObjectType()
class AccessTokenData {
    @Field()
    id: string;
    @Field()
    type?: JwtType;
}

@ObjectType()
class RefreshTokenData {
    @Field()
    id: string;
    @Field()
    version: number;
    @Field()
    type?: JwtType;
}

@ObjectType()
class ApiKeyData {
    @Field()
    id: string;
    @Field()
    secret: string;
    @Field()
    type?: JwtType;
}

export const encrypt_personalized_data = (value: string, key: string): string => {
    if (!value)
        return null;
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, process.env.PERSONALIZED_DATA_HASH_KEY, key)
    return Buffer.concat([cipher.update(value), cipher.final()]).toString('hex');
}

export const encrypt_personalized_key = (key: string): string => {
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, process.env.PERSONALIZED_SECRET_HASH_KEY, process.env.PERSONALIZED_SECRET_CRYPTO_KEY)
    return Buffer.concat([cipher.update(key), cipher.final()]).toString('hex');
}

export const encrypt_access_key = (key: string): string => {
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, process.env.API_ACCESSTOKEN_HASH_KEY, process.env.API_ACCESSTOKEN_CRYPTO_KEY)
    return Buffer.concat([cipher.update(key), cipher.final()]).toString('hex');
}

export const encrypt_private_key = (key: string): string => {
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, process.env.PRIVATE_KEY_HASH_KEY, process.env.PRIVATE_KEY_CRYPTO_KEY)
    return Buffer.concat([cipher.update(key), cipher.final()]).toString('hex');
}

export const decrypt_personalized_data = (hash: string, key: string): string => {
    if (!hash)
        return null;
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, process.env.PERSONALIZED_DATA_HASH_KEY, key);
    return Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]).toString();
}

export const decrypt_personalized_key = (hash: string): string => {
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, process.env.PERSONALIZED_SECRET_HASH_KEY, process.env.PERSONALIZED_SECRET_CRYPTO_KEY);
    return Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]).toString();
}

export const decrypt_access_key = (hash: string): string => {
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, process.env.API_ACCESSTOKEN_HASH_KEY, process.env.API_ACCESSTOKEN_CRYPTO_KEY);
    return Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]).toString();
}

export const decrypt_private_key = (hash: string): string => {
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, process.env.PRIVATE_KEY_HASH_KEY, process.env.PRIVATE_KEY_CRYPTO_KEY);
    return Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]).toString();
}

export const verify_password = (to_check: string, original: string, decrypt_key: string): boolean => {
    return hash_password(to_check) == decrypt_personalized_data(original, decrypt_key);
}

export const hash_password = (password: string): string => {
    if (password == undefined) {
        return null;
    }
    return createHmac(PASSWORD_HASH_ALGORITHM, process.env.PASSWORD_HASH_KEY!)
        .update(password)
        .digest('hex')
}

export const encrypt_with_rsa_public_key = (value: string, public_key: string) => {
    var buffer = Buffer.from(value);
    var encrypted = crypto.publicEncrypt(public_key, buffer);
    return encrypted.toString("base64");
};

export const decrypt_with_rsa_private_key = (hash: string, private_key: string): string => {
    try {
        var buffer = Buffer.from(hash, "base64");
        var decrypted = crypto.privateDecrypt({
            key: private_key.toString(),
            passphrase: process.env.PRIVATE_KEY_PASSPHRASE,
        }, buffer);
        return decrypted.toString("utf8");
    } catch (err) {
        return "";
    }
};

const sign_data_jwt = async (data: AccessTokenData | RefreshTokenData | ApiKeyData, options: SignOptions = {}, type: JwtType = JwtType.ACCESS_TOKEN): Promise<string> => {
    const id = data.id;
    return User.findOne({ select: ["jwt_secret"], where: { id: id } }).then(user => {
        if (!user)
            return undefined;
        const hashedSecret = generate_hashed_secret(user.jwt_secret, type)
        options.algorithm = 'HS512';
        data.type = type;
        return sign(data, hashedSecret, options);
    });
}

export const verify_data_jwt = async (token: string) => {
    if (!token || !token.includes("."))
        throw new Error('invalid token');
    const body = token.split(".")[1];
    const data: ApiKeyData | AccessTokenData | RefreshTokenData = JSON.parse(Buffer.from(body, 'base64').toString('ascii'));
    if (!data)
        throw new Error('invalid token');
    return await User.findOne({ select: ["jwt_secret"], where: { id: data.id } }).then(async (user) => {
        if (!user)
            throw new Error('invalid token');
        const hashedSecret = generate_hashed_secret(user.jwt_secret, data.type)
        return verify(token, hashedSecret);
    })
}

const generate_hashed_secret = (jwt_secret: string, type: JwtType): string => {
    switch (type) {
        case JwtType.ACCESS_TOKEN:
            return createHmac('sha512', process.env.REFRESH_TOKEN_SECRET!)
                .update(jwt_secret)
                .digest('base64');
        case JwtType.REFRESH_TOKEN:
            return createHmac('sha512', process.env.ACCESS_TOKEN_SECRET!)
                .update(jwt_secret)
                .digest('base64');
        case JwtType.API_KEY:
            return createHmac('sha512', process.env.API_KEY_SECRET!)
                .update(jwt_secret)
                .digest('base64');
    }
}

export const generate_access_token = async (user: User): Promise<string> => {
    return await sign_data_jwt({ id: user.id }, { expiresIn: "15m" })
}

export const generate_refresh_token = async (user: User): Promise<string> => {
    return await sign_data_jwt({ id: user.id, version: user.jwt_version }, { expiresIn: "7d" }, JwtType.REFRESH_TOKEN)
}

export const generate_api_key = async (user_id: string, secret: string): Promise<string> => {
    return await sign_data_jwt({ id: user_id, secret: secret }, { expiresIn: "99y" }, JwtType.API_KEY)
}

export const send_refresh_token = (res: Response, token: string): void => {
    res.cookie('lid', token, {
        httpOnly: true
    });
}

export const generate_random_secret = (lenght: number): string => {
    let password = "";
    for (let i = 0; i < lenght; i++) {
        const randomNumber = Math.floor(Math.random() * SECRET_CHARS.length);
        password += SECRET_CHARS.substring(randomNumber, randomNumber + 1);
    }
    return password;
}