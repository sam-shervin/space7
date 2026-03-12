/**
 * Tests for src/api/Auth.ts
 */

import {
	signup,
	verifyOTP,
	login,
	forgotPassword,
	resetPassword,
} from "../../src/api/Auth";

const mockFetch = jest.fn();
global.fetch = mockFetch;

const makeOkResponse = (body: object, status = 200) => ({
	ok: true,
	status,
	json: jest.fn().mockResolvedValue(body),
});

const makeErrorResponse = (body: object, status = 400) => ({
	ok: false,
	status,
	json: jest.fn().mockResolvedValue(body),
});

beforeEach(() => {
	mockFetch.mockReset();
});

// ─── signup ──────────────────────────────────────────────────────────────────

describe("signup", () => {
	it("calls the signup endpoint with correct payload", async () => {
		mockFetch.mockResolvedValueOnce(
			makeOkResponse({ message: "OTP sent" }, 201),
		);

		const result = await signup("alice", "alice@example.com", "password123");

		expect(mockFetch).toHaveBeenCalledTimes(1);
		const [url, options] = mockFetch.mock.calls[0];
		expect(url).toContain("/api/auth/signup");
		expect(options.method).toBe("POST");
		expect(JSON.parse(options.body)).toEqual({
			username: "alice",
			email: "alice@example.com",
			password: "password123",
		});
		expect(result.status).toBe(201);
	});

	it("throws when the server returns an error", async () => {
		mockFetch.mockResolvedValueOnce(
			makeErrorResponse({ error: "Email already in use" }, 409),
		);

		await expect(
			signup("alice", "alice@example.com", "password123"),
		).rejects.toThrow("Email already in use");
	});

	it("throws with default message when server error has no message", async () => {
		mockFetch.mockResolvedValueOnce(makeErrorResponse({}, 500));

		await expect(
			signup("alice", "alice@example.com", "password123"),
		).rejects.toThrow("Signup failed");
	});
});

// ─── verifyOTP ───────────────────────────────────────────────────────────────

describe("verifyOTP", () => {
	it("calls the verify-otp endpoint with correct payload", async () => {
		mockFetch.mockResolvedValueOnce(
			makeOkResponse({ token: "jwt-token", status: 200 }),
		);

		const result = await verifyOTP("123456", "alice@example.com");

		const [url, options] = mockFetch.mock.calls[0];
		expect(url).toContain("/api/auth/verify-otp");
		expect(options.method).toBe("POST");
		expect(JSON.parse(options.body)).toEqual({
			otp: "123456",
			email: "alice@example.com",
		});
		expect(result.token).toBe("jwt-token");
	});

	it("throws when OTP is invalid", async () => {
		mockFetch.mockResolvedValueOnce(
			makeErrorResponse({ error: "OTP verification failed" }, 400),
		);

		await expect(
			verifyOTP("000000", "alice@example.com"),
		).rejects.toThrow("OTP verification failed");
	});

	it("throws with default message when server error has no message", async () => {
		mockFetch.mockResolvedValueOnce(makeErrorResponse({}, 500));

		await expect(
			verifyOTP("000000", "alice@example.com"),
		).rejects.toThrow("OTP verification failed");
	});
});

// ─── login ───────────────────────────────────────────────────────────────────

describe("login", () => {
	const loginPayload = {
		token: "jwt-token",
		user: {
			user_id: "uuid-1",
			username: "alice",
			profile_picture: "",
		},
	};

	it("calls the login endpoint and returns token + user", async () => {
		mockFetch.mockResolvedValueOnce(makeOkResponse(loginPayload));

		const result = await login("alice@example.com", "password123");

		const [url, options] = mockFetch.mock.calls[0];
		expect(url).toContain("/api/auth/login");
		expect(options.method).toBe("POST");
		expect(JSON.parse(options.body)).toEqual({
			email: "alice@example.com",
			password: "password123",
		});
		expect(result.token).toBe("jwt-token");
		expect(result.user.username).toBe("alice");
	});

	it("throws when credentials are invalid", async () => {
		mockFetch.mockResolvedValueOnce(
			makeErrorResponse({ error: "Invalid credentials" }, 401),
		);

		await expect(login("alice@example.com", "wrong")).rejects.toThrow(
			"Invalid credentials",
		);
	});

	it("throws with default message when server returns no error field", async () => {
		mockFetch.mockResolvedValueOnce(makeErrorResponse({}, 500));

		await expect(login("alice@example.com", "password123")).rejects.toThrow(
			"Login failed",
		);
	});
});

// ─── forgotPassword ──────────────────────────────────────────────────────────

describe("forgotPassword", () => {
	it("calls the forgot-password endpoint with correct email", async () => {
		mockFetch.mockResolvedValueOnce(
			makeOkResponse({ message: "Reset email sent" }),
		);

		const result = await forgotPassword("alice@example.com");

		const [url, options] = mockFetch.mock.calls[0];
		expect(url).toContain("/api/auth/forgot-password");
		expect(options.method).toBe("POST");
		expect(JSON.parse(options.body)).toEqual({ email: "alice@example.com" });
		expect(result.message).toBe("Reset email sent");
	});

	it("throws when email is not found", async () => {
		mockFetch.mockResolvedValueOnce(
			makeErrorResponse({ error: "User not found" }, 404),
		);

		await expect(forgotPassword("unknown@example.com")).rejects.toThrow(
			"User not found",
		);
	});

	it("throws with default message when server returns no error field", async () => {
		mockFetch.mockResolvedValueOnce(makeErrorResponse({}, 500));

		await expect(forgotPassword("alice@example.com")).rejects.toThrow(
			"Forgot password request failed",
		);
	});
});

// ─── resetPassword ───────────────────────────────────────────────────────────

describe("resetPassword", () => {
	it("calls the reset-password endpoint with correct payload", async () => {
		mockFetch.mockResolvedValueOnce(
			makeOkResponse({ message: "Password reset" }),
		);

		const result = await resetPassword(
			"alice@example.com",
			"123456",
			"newPass123",
		);

		const [url, options] = mockFetch.mock.calls[0];
		expect(url).toContain("/api/auth/reset-password");
		expect(options.method).toBe("POST");
		expect(JSON.parse(options.body)).toEqual({
			email: "alice@example.com",
			otp: "123456",
			newPassword: "newPass123",
		});
		expect(result.message).toBe("Password reset");
	});

	it("throws when OTP is expired", async () => {
		mockFetch.mockResolvedValueOnce(
			makeErrorResponse({ error: "OTP expired" }, 400),
		);

		await expect(
			resetPassword("alice@example.com", "000000", "newPass123"),
		).rejects.toThrow("OTP expired");
	});

	it("throws with default message when server returns no error field", async () => {
		mockFetch.mockResolvedValueOnce(makeErrorResponse({}, 500));

		await expect(
			resetPassword("alice@example.com", "000000", "newPass123"),
		).rejects.toThrow("Reset password request failed");
	});
});
