import type { Mock } from 'node:test';

import type { FastifyReply, FastifyRequest } from 'fastify';

export type MockRequest = FastifyRequest & {
	query: unknown;
	params: unknown;
	body: unknown;
	payload: {
		role: string;
		isVerified: boolean;
	};
	user:
		| {
				sub: string;
				role: string;
				isVerified: boolean;
		  }
		| undefined;
};

export type MockReply = FastifyReply & {
	status: Mock<(code: number) => FastifyReply>;
	send: Mock<(payload?: unknown) => FastifyReply>;
};

interface ITestContext {
	mock: {
		fn: <T extends (...args: never[]) => unknown>(
			implementation?: T
		) => Mock<T>;
	};
}

export function createMockRequest({
	query,
	params,
	body,
	payload,
	user,
}: {
	query?: unknown;
	params?: unknown;
	body?: unknown;
	user?: {
		sub: string;
		role: string;
		isVerified: boolean;
	};
	payload?: {
		role: string;
		isVerified: boolean;
	};
} = {}): MockRequest {
	return {
		query: query ?? {},
		params: params ?? {},
		body: body ?? {},
		user: user ?? undefined,
		payload: payload ?? { role: '', isVerified: false },
	} as unknown as MockRequest;
}

export function createMockReply(t: ITestContext): MockReply {
	const mockReply = {
		status: t.mock.fn((_code: number) => mockReply),
		send: t.mock.fn((_payload?: unknown) => mockReply),
	} as unknown as MockReply;

	return mockReply;
}
