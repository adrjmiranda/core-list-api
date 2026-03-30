export interface ITokenPayload {
	sub: string;
	role: string;
	isVerified: boolean;
}

export interface ITokenProvider {
	generate(payload: object, subject: string, expiresIn: string): string;
	verify(token: string): ITokenPayload;
}
