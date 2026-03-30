import { Readable } from 'node:stream';

import { FastifyReply, FastifyRequest } from 'fastify';

import { env } from '#/shared/env/env.js';

export interface IHttpRequest {
	body?: unknown;
	params?: unknown;
	query?: unknown;
	userId?: string;
	userRole?: string;
	userIsVerified: boolean;
	cookies?: Record<string, string | undefined>;
	file?: () => Promise<
		| {
				file: Readable;
				filename: string;
				mimetype: string;
				encoding: string;
		  }
		| undefined
	>;
}

export interface IHttpResponse {
	statusCode: number;
	body?: unknown;
	headers?: Record<string, string>;
	redirect?: string;
}

interface IController {
	handle(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export const httpRouteAdapter = (controller: IController) => {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		const userId = request.user?.sub ? String(request.user.sub) : undefined;
		const userRole = request.user?.role ? String(request.user.role) : undefined;
		const userIsVerified = Boolean(request.user?.isVerified);
		const httpRequest = {
			body: request.body,
			params: request.params,
			query: request.query,
			userId,
			userRole,
			userIsVerified,
			file: async () => await request.file(),
		};

		const httpResponse = await controller.handle(httpRequest);

		const { body, statusCode, headers, redirect } = httpResponse;

		if (headers) {
			Object.entries(headers).forEach(([key, value]) => {
				reply.header(key, value);
			});
		}

		if (redirect) {
			return reply.redirect(redirect);
		}

		if (body && typeof body === 'object' && 'refreshToken' in body) {
			reply.setCookie('refreshToken', String(body.refreshToken), {
				path: '/',
				secure: env.NODE_ENV === 'production',
				sameSite: true,
				httpOnly: true,
			});

			delete body.refreshToken;
		}

		return reply.status(statusCode).send(body);
	};
};
