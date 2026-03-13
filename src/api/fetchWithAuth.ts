import { notifyUnauthorizedLogout } from "../context/AuthContext";
import { getToken } from "../utils/authStore";

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
	const token = await getToken();
	const isFormData =
		typeof FormData !== "undefined" && options.body instanceof FormData;
	const headers: Record<string, string> = {
		...((options.headers as Record<string, string> | undefined) || {}),
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};

	if (!isFormData && !("Content-Type" in headers)) {
		headers["Content-Type"] = "application/json";
	}

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
