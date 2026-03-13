/**
 * Tests for src/api/Messages.ts (text-only / non-media paths)
 */

import {
	deleteMessage,
	getMessages,
	type Message,
	sendMessage,
	toggleMessageAppreciation,
} from "../../src/api/Messages";

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

const sampleMessage: Message = {
	message_id: "msg-1",
	space_id: "space-1",
	sender_id: "user-1",
	content: "Hello world",
	media_url: null,
	media_type: null,
	word_count: 2,
	sender: { user_id: "user-1", username: "alice", profile_picture: "" },
	likes: [],
	appreciation_count: 0,
	created_at: "2026-03-12T00:00:00.000Z",
};

beforeEach(() => {
	mockFetchWithAuth.mockReset();
});

// ─── getMessages ──────────────────────────────────────────────────────────────

describe("getMessages", () => {
	const messagesResponse = {
		messages: [sampleMessage],
		total: 1,
		page: 1,
		totalPages: 1,
	};

	it("fetches messages with default options", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(makeOkResponse(messagesResponse));

		const result = await getMessages("space-1");

		const [url, options] = mockFetchWithAuth.mock.calls[0];
		expect(url).toContain("/api/messages/space-1");
		expect(url).toContain("sort=recent");
		expect(url).toContain("page=1");
		expect(url).toContain("limit=50");
		expect(options?.method).toBe("GET");
		expect(result.messages).toHaveLength(1);
		expect(result.total).toBe(1);
	});

	it("passes custom sort, page and limit", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(makeOkResponse(messagesResponse));

		await getMessages("space-1", {
			sort: "most_appreciated",
			page: 2,
			limit: 20,
		});

		const [url] = mockFetchWithAuth.mock.calls[0];
		expect(url).toContain("sort=most_appreciated");
		expect(url).toContain("page=2");
		expect(url).toContain("limit=20");
	});

	it("throws on error response", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(
			makeErrorResponse({ error: "Space not found" }, 404),
		);

		await expect(getMessages("unknown-space")).rejects.toThrow(
			"Space not found",
		);
	});

	it("throws with default message when no error field", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(makeErrorResponse({}, 500));

		await expect(getMessages("space-1")).rejects.toThrow(
			"Failed to fetch messages",
		);
	});
});

// ─── sendMessage validation ───────────────────────────────────────────────────
// Only the client-side validation path (no media involved).

describe("sendMessage – client-side validation", () => {
	it("throws immediately when content is empty and no media", async () => {
		await expect(sendMessage("space-1", { content: "   " })).rejects.toThrow(
			"Message must have text or media",
		);
	});

	it("throws immediately when neither content nor media is provided", async () => {
		await expect(sendMessage("space-1", {})).rejects.toThrow(
			"Message must have text or media",
		);
	});

	it("calls fetchWithAuth for valid text-only message", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(makeOkResponse(sampleMessage));

		const result = await sendMessage("space-1", { content: "Hello" });

		expect(mockFetchWithAuth).toHaveBeenCalledTimes(1);
		const [url, options] = mockFetchWithAuth.mock.calls[0];
		expect(url).toContain("/api/messages/space-1");
		expect(options?.method).toBe("POST");
		expect(result.content).toBe("Hello world");
	});
});

// ─── toggleMessageAppreciation ────────────────────────────────────────────────

describe("toggleMessageAppreciation", () => {
	it("POSTs to the appreciate endpoint and returns the result", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(
			makeOkResponse({ appreciated: true }),
		);

		const result = await toggleMessageAppreciation("space-1", "msg-1");

		const [url, options] = mockFetchWithAuth.mock.calls[0];
		expect(url).toContain("/api/messages/space-1/msg-1/appreciate");
		expect(options?.method).toBe("POST");
		expect(result.appreciated).toBe(true);
	});

	it("throws on error response", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(
			makeErrorResponse({ error: "Failed to appreciate message" }, 500),
		);

		await expect(toggleMessageAppreciation("space-1", "msg-1")).rejects.toThrow(
			"Failed to appreciate message",
		);
	});
});

// ─── deleteMessage ────────────────────────────────────────────────────────────

describe("deleteMessage", () => {
	it("sends DELETE request and returns success message", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(
			makeOkResponse({ message: "Message deleted" }),
		);

		const result = await deleteMessage("space-1", "msg-1");

		const [url, options] = mockFetchWithAuth.mock.calls[0];
		expect(url).toContain("/api/messages/space-1/msg-1");
		expect(options?.method).toBe("DELETE");
		expect(result.message).toBe("Message deleted");
	});

	it("throws on error response", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(
			makeErrorResponse({ error: "Message not found" }, 404),
		);

		await expect(deleteMessage("space-1", "missing-msg")).rejects.toThrow(
			"Message not found",
		);
	});

	it("throws with default message when no error field", async () => {
		mockFetchWithAuth.mockResolvedValueOnce(makeErrorResponse({}, 500));

		await expect(deleteMessage("space-1", "msg-1")).rejects.toThrow(
			"Failed to delete message",
		);
	});
});
