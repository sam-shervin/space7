import { API } from "../constants/Network";
import { fetchWithAuth } from "./fetchWithAuth";

export type Notification = {
	id: number;
	user_id: string;
	type: string;
	message: string;
	reference_id: string;
	is_read: boolean;
	created_at: string;
};

export type NotificationsResponse = {
	notifications: Notification[];
	total: number;
	page: number;
	totalPages: number;
	unreadCount: number;
};

export async function getNotifications(
	page: number = 1,
	limit: number = 30,
): Promise<NotificationsResponse> {
	const res = await fetchWithAuth(
		`${API}/api/notifications?page=${page}&limit=${limit}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		},
	);

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Failed to fetch notifications");
	}
	return data;
}

export async function markNotificationAsRead(
	id: number,
): Promise<{ message: string }> {
	const res = await fetchWithAuth(`${API}/api/notifications/${id}/read`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Failed to mark notification as read");
	}

	return data;
}

export async function markAllNotificationsAsRead(): Promise<{
	message: string;
}> {
	const res = await fetchWithAuth(`${API}/api/notifications/read-all`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Failed to mark all notifications as read");
	}

	return data;
}
