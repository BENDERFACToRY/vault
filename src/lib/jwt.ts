import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

type JWTSignOptions = {
	algorithm?: 'HS256' | 'RS256';
	expiresIn?: string; // zeit/ms
	notBefore?: string; // zeit/ms
	audience?: string;
	issuer?: string;
	jwtid?: string;
	subject: string;
	noTimestamp?: string;
	header?: string;
	keyid?: string;
	mutatePayload?: string;
};

export function createToken(
	token: unknown,
	{ subject, expiresIn = '1 day', issuer = 'auth', ...options }: JWTSignOptions
): string {
	const SECRET = JSON.parse(process.env['VAULT_JWT_SECRET']);

	return jwt.sign(token, SECRET.key, {
		subject,
		expiresIn,
		issuer,
		...options
	});
}

export function parseToken(token: string): JSON {
	return jwt.decode(token);
}

export async function verifyToken(token: string): Promise<JSON> {
	const SECRET = JSON.parse(process.env['VAULT_JWT_SECRET']);

	return await jwt.verify(token, SECRET.key);
}

export function serverToken(username: string, id = -1, role = 'server'): string {
	return createToken(
		{
			id: id.toString(),
			name: username,
			default_role: role,
			roles: [role]
		},
		{
			subject: '-1'
		}
	);
}

// calls a (async) function and only when that function is running will set the token.
export const withServerToken = (name, token) => (func) => (...args) => {
	token.set(serverToken(name));
	try {
		const result = func(...args);
		if (result instanceof Promise) {
			return result
				.then((res) => {
					token.set(null);
					return res;
				})
				.catch((error) => {
					token.set(null);
					throw error;
				});
		} else {
			token.set(null);
			return result;
		}
	} catch (error) {
		token.set(null);
		throw error;
	}
};
