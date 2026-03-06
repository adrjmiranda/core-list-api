import '@fastify/jwt';

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    payload: {
      role: string;
      isVerified: boolean;
    };
    user: {
      sub: string;
      role: string;
      isVerified: boolean;
    };
  }
}
