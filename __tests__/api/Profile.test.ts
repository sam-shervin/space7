/**
 * Tests for src/api/Profile.ts
 */

import { getProfile } from "../../src/api/Profile";

jest.mock("../../src/api/fetchWithAuth", () => ({
	fetchWithAuth: jest.fn(),
}));

import { fetchWithAuth } from "../../src/api/fetchWithAuth";
const mockFetchWithAuth = fetchWithAuth as jest.MockedFunction<
	typeof fetchWithAuth
>;

const makeOkResponse = (body: object, status = 200) =>
	({
		ok: true,
		status,
		json: jest.fn().mockResolvedValue(body),
	}) as unknown as Response;

const makeErrorResponse = (body: object, status = 400) =>
	({
		ok: false,
		status,
		json: jest.fn().mockResolvedValue(body),
	}) as unknown as Response;

const sampleProfile = {
	user_id: "uuid-1",
	username: "alice",
	email: "alice@example.com",
	bio: "Hello there",
	profile_picture: "",
	is_verified: true,
	created_at: "2026-03-10T11:35:34.380Z",
	updated_at: "2026-03-10T11:36:23.347Z",
	stats: {
		spaces_created: 2,
		spaces_participated: 4,
		total_words_contributed: 100,
		total_appreciations_received: 10,
	},
};

beforeEach(() => {
	mockFetchWithAuth.mockReset();
});

describe("getProfile", () => {
	it("calls /api/profile/me with GET via fetchWithAuth", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(makeOkResponse(sampleProfile));

		const result = await getProfile();

		expect(mockFetchWithAuth).toHaveBeenCalledTimes(1);
		const [url, options] = mockFetchWithAuth.mock.calls[0];
		expect(url).toContain("/api/profile/me");
		expect(options?.method).toBe("GET");
		expect(result).toEqual(sampleProfile);
	});

	it("returns the correct profile shape", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(makeOkResponse(sampleProfile));

		const result = await getProfile();

		expect(result.user_id).toBe("uuid-1");
		expect(result.username).toBe("alice");
		expect(result.email).toBe("alice@example.com");
		expect(result.is_verified).toBe(true);
		expect(result.stats.spaces_created).toBe(2);
	});

	it("throws on error response", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(
			makeErrorResponse({ error: "Unauthorized" }, 401),
		);

		await expect(getProfile()).rejects.toThrow("Unauthorized");
	});

	it("throws with default message when no error field", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(makeErrorResponse({}, 500));

		await expect(getProfile()).rejects.toThrow("Failed to fetch profile");
	});
});
