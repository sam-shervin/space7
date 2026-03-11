import { notifyUnauthorizedLogout } from "../context/AuthContext";
import { getToken } from "../utils/authStore";

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
	const token = await getToken();

	const headers = {
		"Content-Type": "application/json",
		...(options.headers || {}),
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};

	const res = await fetch(url, {
		...options,
		headers,
	});

	if (res.status === 401) {
		await notifyUnauthorizedLogout();
		throw new Error("Unauthorized");
	}

	return res;
};
