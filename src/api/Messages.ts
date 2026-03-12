import type { SpaceCreator } from "./Spaces";
import { fetchWithAuth } from "./fetchWithAuth";
import { API } from "../constants/Network";

export type MessageLike = {
	id: number;
	user_id: string;
};

export type Message = {
	message_id: string;
	space_id: string;
	sender_id: string;
	content: string;
	media_url: string | null;
	media_type: string | null;
	word_count: number;
	sender: SpaceCreator;
	likes: MessageLike[];
	appreciation_count: number;
	created_at: string;
};

export type MessagesResponse = {
	messages: Message[];
	total: number;
	page: number;
	totalPages: number;
};

type GetMessagesOptions = {
	sort?: "recent" | "most_appreciated";
	page?: number;
	limit?: number;
};

type SendMessagePayload = {
	content?: string;
	media?: {
		uri: string;
		name?: string;
		type?: string;
	} | null;
	media_type?: string;
};

const getMessages = async (
	spaceId: string,
	options: GetMessagesOptions = {},
): Promise<MessagesResponse> => {
	const sort = options.sort ?? "recent";
	const page = options.page ?? 1;
	const limit = options.limit ?? 50;
	const query = `?sort=${sort}&page=${page}&limit=${limit}`;

	const res = await fetchWithAuth(`${API}/api/messages/${spaceId}${query}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Failed to fetch messages");
	}

	return data;
};

const sendMessage = async (
	spaceId: string,
	payload: SendMessagePayload,
): Promise<Message> => {
	if (!payload.content?.trim() && !payload.media) {
		throw new Error("Message must have text or media");
	}

	const formData = new FormData();

	if (payload.content?.trim()) {
		formData.append("content", payload.content.trim());
	}

	if (payload.media) {
		formData.append("media", {
			uri: payload.media.uri,
			name: payload.media.name ?? "upload",
			type: payload.media.type ?? "application/octet-stream",
		} as never);
	}

	if (payload.media_type) {
		formData.append("media_type", payload.media_type);
	}

	const res = await fetchWithAuth(`${API}/api/messages/${spaceId}`, {
		method: "POST",
		body: formData,
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Failed to send message");
	}

	return data;
};

const toggleMessageAppreciation = async (
	spaceId: string,
	messageId: string,
): Promise<{ appreciated: boolean }> => {
	const res = await fetchWithAuth(
		`${API}/api/messages/${spaceId}/${messageId}/appreciate`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		},
	);

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Failed to appreciate message");
	}

	return data;
};

const deleteMessage = async (
	spaceId: string,
	messageId: string,
): Promise<{ message: string }> => {
	const res = await fetchWithAuth(`${API}/api/messages/${spaceId}/${messageId}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Failed to delete message");
	}

	return data;
};

export { getMessages, sendMessage, toggleMessageAppreciation, deleteMessage };
