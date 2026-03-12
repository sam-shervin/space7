/**
 * Tests for src/api/Spaces.ts
 */

import {
	createSpace,
	getMySpaces,
	getRecommendedSpaces,
	getSpaceById,
	getTrendingSpaces,
	joinSpace,
	type Space,
} from "../../src/api/Spaces";

// fetchWithAuth is used by most Spaces functions; mock it
jest.mock("../../src/api/fetchWithAuth", () => ({
	fetchWithAuth: jest.fn(),
}));

import { fetchWithAuth } from "../../src/api/fetchWithAuth";

const mockFetchWithAuth = fetchWithAuth as jest.MockedFunction<
	typeof fetchWithAuth
>;

const mockFetch = jest.fn();
global.fetch = mockFetch;

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

const sampleSpace: Space = {
	space_id: "space-1",
	title: "Test Space",
	description: "A test space",
	visibility: "public",
	creator: { user_id: "user-1", username: "alice", profile_picture: "" },
	participant_count: 5,
	tags: [{ tag_id: 1, tag_name: "tech" }],
};

beforeEach(() => {
	mockFetch.mockReset();
	mockFetchWithAuth.mockReset();
});

// ─── getTrendingSpaces ────────────────────────────────────────────────────────

describe("getTrendingSpaces", () => {
	it("fetches trending spaces without auth using global fetch", async () => {
		mockFetch.mockResolvedValueOnce(makeOkResponse([sampleSpace]));

		const result = await getTrendingSpaces();

		expect(mockFetch).toHaveBeenCalledTimes(1);
		const [url] = mockFetch.mock.calls[0];
		expect(url).toContain("/api/spaces/trending");
		expect(url).toContain("limit=10");
		expect(result).toEqual([sampleSpace]);
	});

	it("respects custom limit option", async () => {
		mockFetch.mockResolvedValueOnce(makeOkResponse([]));

		await getTrendingSpaces({ limit: 5 });

		const [url] = mockFetch.mock.calls[0];
		expect(url).toContain("limit=5");
	});

	it("throws on error response", async () => {
		mockFetch.mockResolvedValueOnce(
			makeErrorResponse({ error: "Service unavailable" }, 503),
		);

		await expect(getTrendingSpaces()).rejects.toThrow("Service unavailable");
	});

	it("throws with default message when no error field", async () => {
		mockFetch.mockResolvedValueOnce(makeErrorResponse({}, 500));

		await expect(getTrendingSpaces()).rejects.toThrow(
			"Failed to fetch trending spaces",
		);
	});
});

// ─── getRecommendedSpaces ─────────────────────────────────────────────────────

describe("getRecommendedSpaces", () => {
	it("fetches recommended spaces via fetchWithAuth", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(makeOkResponse([sampleSpace]));

		const result = await getRecommendedSpaces();

		expect(mockFetchWithAuth).toHaveBeenCalledTimes(1);
		const [url] = mockFetchWithAuth.mock.calls[0];
		expect(url).toContain("/api/spaces/recommended");
		expect(url).toContain("limit=10");
		expect(result).toEqual([sampleSpace]);
	});

	it("respects custom limit option", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(makeOkResponse([]));

		await getRecommendedSpaces({ limit: 3 });

		const [url] = mockFetchWithAuth.mock.calls[0];
		expect(url).toContain("limit=3");
	});

	it("throws on error response", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(
			makeErrorResponse({ error: "Unauthorized" }, 401),
		);

		await expect(getRecommendedSpaces()).rejects.toThrow("Unauthorized");
	});
});

// ─── getMySpaces ──────────────────────────────────────────────────────────────

describe("getMySpaces", () => {
	it("fetches my spaces via fetchWithAuth without query by default", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(makeOkResponse([sampleSpace]));

		const result = await getMySpaces();

		const [url] = mockFetchWithAuth.mock.calls[0];
		expect(url).toContain("/api/spaces/my");
		expect(result).toEqual([sampleSpace]);
	});

	it("appends visibility filter when provided", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(makeOkResponse([]));

		await getMySpaces({ visibility: "private" });

		const [url] = mockFetchWithAuth.mock.calls[0];
		expect(url).toContain("visibility=private");
	});

	it("throws on error response", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(
			makeErrorResponse({ error: "Failed to fetch my spaces" }, 500),
		);

		await expect(getMySpaces()).rejects.toThrow("Failed to fetch my spaces");
	});
});

// ─── createSpace ──────────────────────────────────────────────────────────────

describe("createSpace", () => {
	it("POSTs the correct payload and returns the created space", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(makeOkResponse(sampleSpace, 201));

		const result = await createSpace({
			title: "Test Space",
			description: "A test space",
			visibility: "public",
			hashtags: ["tech"],
		});

		const [url, options] = mockFetchWithAuth.mock.calls[0];
		expect(url).toContain("/api/spaces");
		expect(options?.method).toBe("POST");
		expect(JSON.parse(options?.body as string)).toEqual({
			title: "Test Space",
			description: "A test space",
			visibility: "public",
			hashtags: ["tech"],
		});
		expect(result).toEqual(sampleSpace);
	});

	it("throws on error response", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(
			makeErrorResponse({ error: "Title already taken" }, 409),
		);

		await expect(
			createSpace({
				title: "Test Space",
				description: "desc",
				visibility: "public",
				hashtags: [],
			}),
		).rejects.toThrow("Title already taken");
	});

	it("throws with default message when no error field", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(makeErrorResponse({}, 500));

		await expect(
			createSpace({
				title: "Test Space",
				description: "desc",
				visibility: "public",
				hashtags: [],
			}),
		).rejects.toThrow("Failed to create space");
	});
});

// ─── getSpaceById ─────────────────────────────────────────────────────────────

describe("getSpaceById", () => {
	it("fetches a space by ID via fetchWithAuth", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(makeOkResponse(sampleSpace));

		const result = await getSpaceById("space-1");

		const [url] = mockFetchWithAuth.mock.calls[0];
		expect(url).toContain("/api/spaces/space-1");
		expect(result).toEqual(sampleSpace);
	});

	it("throws on error response", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(
			makeErrorResponse({ error: "Space not found" }, 404),
		);

		await expect(getSpaceById("unknown")).rejects.toThrow("Space not found");
	});
});

// ─── joinSpace ────────────────────────────────────────────────────────────────

describe("joinSpace", () => {
	it("sends a POST request to join a public space", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(
			makeOkResponse({ message: "Joined successfully" }),
		);

		const result = await joinSpace("space-1");

		const [url, options] = mockFetchWithAuth.mock.calls[0];
		expect(url).toContain("/api/spaces/space-1/join");
		expect(options?.method).toBe("POST");
		expect(result.message).toBe("Joined successfully");
	});

	it("sends invite_code when joining a private space", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(
			makeOkResponse({ message: "Joined successfully" }),
		);

		await joinSpace("space-2", { invite_code: "SECRET" });

		const [, options] = mockFetchWithAuth.mock.calls[0];
		expect(JSON.parse(options?.body as string)).toEqual({
			invite_code: "SECRET",
		});
	});

	it("throws on error response", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(
			makeErrorResponse({ error: "Invalid invite code" }, 403),
		);

		await expect(
			joinSpace("space-3", { invite_code: "WRONG" }),
		).rejects.toThrow("Invalid invite code");
	});
});
