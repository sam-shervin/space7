/**
 * Tests for src/api/fetchWithAuth.ts
 */

import { fetchWithAuth } from "../../src/api/fetchWithAuth";

jest.mock("../../src/utils/authStore", () => ({
	getToken: jest.fn(),
}));

jest.mock("../../src/context/AuthContext", () => ({
	notifyUnauthorizedLogout: jest.fn(),
}));

import { getToken } from "../../src/utils/authStore";
import { notifyUnauthorizedLogout } from "../../src/context/AuthContext";

const mockGetToken = getToken as jest.MockedFunction<typeof getToken>;
const mockNotifyUnauthorizedLogout =
	notifyUnauthorizedLogout as jest.MockedFunction<
		typeof notifyUnauthorizedLogout
	>;

const mockFetch = jest.fn();
global.fetch = mockFetch;

const makeResponse = (status: number, body: object = {}) =>
	({
		ok: status >= 200 && status < 300,
		status,
		json: jest.fn().mockResolvedValue(body),
	}) as unknown as Response;

beforeEach(() => {
	mockFetch.mockReset();
	mockGetToken.mockReset();
	mockNotifyUnauthorizedLogout.mockReset();
});

describe("fetchWithAuth", () => {
	it("attaches Authorization header when token exists", async () => {
		mockGetToken.mockResolvedValueOnce("my-jwt-token");
		mockFetch.mockResolvedValueOnce(makeResponse(200));

		await fetchWithAuth("https://api.example.com/data");

		const [, options] = mockFetch.mock.calls[0];
		expect(options.headers["Authorization"]).toBe("Bearer my-jwt-token");
	});

	it("does NOT attach Authorization header when no token", async () => {
		mockGetToken.mockResolvedValueOnce(null);
		mockFetch.mockResolvedValueOnce(makeResponse(200));

		await fetchWithAuth("https://api.example.com/data");

		const [, options] = mockFetch.mock.calls[0];
		expect(options.headers["Authorization"]).toBeUndefined();
	});

	it("sets Content-Type to application/json by default (non-FormData)", async () => {
		mockGetToken.mockResolvedValueOnce(null);
		mockFetch.mockResolvedValueOnce(makeResponse(200));

		await fetchWithAuth("https://api.example.com/data", { method: "POST" });

		const [, options] = mockFetch.mock.calls[0];
		expect(options.headers["Content-Type"]).toBe("application/json");
	});

	it("does NOT override Content-Type when caller provides it", async () => {
		mockGetToken.mockResolvedValueOnce(null);
		mockFetch.mockResolvedValueOnce(makeResponse(200));

		await fetchWithAuth("https://api.example.com/data", {
			method: "POST",
			headers: { "Content-Type": "text/plain" },
		});

		const [, options] = mockFetch.mock.calls[0];
		expect(options.headers["Content-Type"]).toBe("text/plain");
	});

	it("does NOT set Content-Type when body is FormData", async () => {
		mockGetToken.mockResolvedValueOnce(null);
		mockFetch.mockResolvedValueOnce(makeResponse(200));

		const formData = new FormData();
		formData.append("key", "value");

		await fetchWithAuth("https://api.example.com/upload", {
			method: "POST",
			body: formData,
		});

		const [, options] = mockFetch.mock.calls[0];
		expect(options.headers["Content-Type"]).toBeUndefined();
	});

	it("returns the response on success", async () => {
		mockGetToken.mockResolvedValueOnce("token");
		const mockRes = makeResponse(200, { success: true });
		mockFetch.mockResolvedValueOnce(mockRes);

		const res = await fetchWithAuth("https://api.example.com/data");

		expect(res.status).toBe(200);
	});

	it("calls notifyUnauthorizedLogout and throws on 401", async () => {
		mockGetToken.mockResolvedValueOnce("expired-token");
		mockNotifyUnauthorizedLogout.mockResolvedValueOnce(undefined);
		mockFetch.mockResolvedValueOnce(makeResponse(401));

		await expect(
			fetchWithAuth("https://api.example.com/data"),
		).rejects.toThrow("Unauthorized");

		expect(mockNotifyUnauthorizedLogout).toHaveBeenCalledTimes(1);
	});

	it("merges caller-provided headers with auth header", async () => {
		mockGetToken.mockResolvedValueOnce("abc");
		mockFetch.mockResolvedValueOnce(makeResponse(200));

		await fetchWithAuth("https://api.example.com/data", {
			headers: { "X-Custom": "yes" },
		});

		const [, options] = mockFetch.mock.calls[0];
		expect(options.headers["X-Custom"]).toBe("yes");
		expect(options.headers["Authorization"]).toBe("Bearer abc");
	});
});
