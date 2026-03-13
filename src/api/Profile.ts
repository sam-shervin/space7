import { API } from "../constants/Network";
import { fetchWithAuth } from "./fetchWithAuth";

type stats = {
	spaces_created: number;
	spaces_participated: number;
	total_words_contributed: number;
	total_appreciations_received: number;
};

export type Profile = {
	user_id: string;
	username: string;
	email: string;
	bio: string;
	profile_picture: string;
	is_verified: boolean;
	created_at: string;
	updated_at: string;
	stats: stats;
};

const getProfile = async (): Promise<Profile> => {
	const res = await fetchWithAuth(`${API}/api/profile/me`, {
		method: "GET",
	});
	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Failed to fetch profile");
	}

	return data;
};

export { getProfile };
