export const datetimeAfter = (seconds: number) => {
	const time = new Date();
	time.setSeconds(time.getSeconds() + seconds);
	return time;
};

export const getCookies = (cookie) =>
	Object.fromEntries(
		cookie ? cookie.split(';').map((c) => c.split('=').map((c2) => c2.trim())) : []
	);

export const setCookie = (name, value, { path = '/', expires = null, httpOnly = true } = {}) => {
	expires = expires ?? datetimeAfter(60 * 60 * 24);

	const parts = [`${name}=${value}`, `Path=${path}`, `Expires=${expires}`];
	if (httpOnly) {
		parts.push(`HttpOnly`);
	}
	return parts.join('; ');
};
