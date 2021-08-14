export const datetimeAfter = (seconds: number): Date => {
	const time = new Date();
	return new Date(time.valueOf() + seconds * 1000);
};

export const getCookies = (cookie: string): { [k: string]: string } =>
	Object.fromEntries(
		cookie ? cookie.split(';').map((c) => c.split('=').map((c2) => c2.trim())) : []
	);

export const setCookie = (
	name: string,
	value: string,
	{
		path = '/',
		expires = null,
		httpOnly = true
	}: { path?: string; expires?: Date; httpOnly?: boolean } = {}
): string => {
	expires = expires ?? datetimeAfter(60 * 60 * 24);

	const parts = [`${name}=${value}`, `Path=${path}`, `Expires=${expires.toUTCString()}`];
	if (httpOnly) {
		parts.push(`HttpOnly`);
	}
	return parts.join('; ');
};
