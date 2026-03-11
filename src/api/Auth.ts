const API = process.env.SERVER_ENDPOINT ?? "";

type LoginResponse = {
	token: string;
	user: {
		user_id: string;
		username: string;
		profile_picture: string;
	};
};

const signup = async (username: string, email: string, password: string) => {
	const res = await fetch(`${API}/api/auth/signup`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username,
			email,
			password,
		}),
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Signup failed");
	}

	return {
		status: res.status,
		...data,
	};
};

const verifyOTP = async (otp: string, email: string) => {
	const res = await fetch(`${API}/api/auth/verify-otp`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			otp,
			email,
		}),
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "OTP verification failed");
	}

	return { status: res.status, ...data };
};

const login = async (
	email: string,
	password: string,
): Promise<LoginResponse> => {
	const res = await fetch(`${API}/api/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			password,
		}),
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Login failed");
	}

	return data;
};

const forgotPassword = async (email: string) => {
	const res = await fetch(`${API}/api/auth/forgot-password`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
		}),
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Forgot password request failed");
	}

	return data;
};

const resetPassword = async (
	email: string,
	otp: string,
	newPassword: string,
) => {
	const res = await fetch(`${API}/api/auth/reset-password`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			otp,
			newPassword,
		}),
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Reset password request failed");
	}

	return data;
};

export { signup, verifyOTP, login, forgotPassword, resetPassword };
