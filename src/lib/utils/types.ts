import type { auth } from '@lib/auth';
import type { ActionResult } from '@sveltejs/kit';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type User = typeof auth.$Infer.Session.user;

export type QuestionType = {
	user: {
		avatar: string | null;
		name: string | null;
		image: string | null;
		id: string;
	};
} & {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	userId: string;
	content: string;
	tags: string[];
	upvotes: string[];
	downvotes: string[];
	is_accepted: boolean;
};

export type EnhanceFunction = (
	formElement: HTMLFormElement,
	context: { formData: FormData; action: string }
) => (event: { result: any; update: () => void }) => void;

interface ActionURL {
	hash: string;
	host: string;
	hostname: string;
	href: string;
	origin: string;
	password: string;
	pathname: string;
	port: string;
	protocol: string;
	search: string;
	searchParams: URLSearchParams;
	username: string;
}

export type EnhanceType = {
	formElement: HTMLFormElement;
	formData: FormData;
	action: ActionURL;
};

export type ReturnEnhanceType = {
	result: ActionResult<Record<string, unknown> | undefined, Record<string, unknown> | undefined>;
	update: (options?: { reset?: boolean; invalidateAll?: boolean }) => void;
};
