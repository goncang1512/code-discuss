import type { ActionResult } from '@sveltejs/kit';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type UserType = {
	id: string;
	name: string;
	email: string;
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

export type EnanceType = {
	formElement: HTMLFormElement;
	formData: FormData;
	action: ActionURL;
};

export type ReturnEnanceType = {
	result: ActionResult<Record<string, unknown> | undefined, Record<string, unknown> | undefined>;
	update: (options?: { reset?: boolean; invalidateAll?: boolean }) => void;
};
