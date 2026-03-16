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

export type ProfileMessageResponse = {
	message: string;
};

export type ProfileErrorResponse = {
	error: string;
};

export type UpdateUsernamePayload = {
	username: string;
};

export type UpdateBioPayload = {
	bio: string;
};

export type UpdatePasswordPayload = {
	currentPassword: string;
	newPassword: string;
};

export type UpdateProfilePicturePayload = {
	uri: string;
	name?: string;
	type?: string;
};

export type UpdateProfilePictureResponse = {
	profile_picture: string;
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

const updateUsername = async (
	payload: UpdateUsernamePayload,
): Promise<ProfileMessageResponse> => {
	const res = await fetchWithAuth(`${API}/api/profile/username`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Failed to update username");
	}

	return data;
};

const updateBio = async (
	payload: UpdateBioPayload,
): Promise<ProfileMessageResponse> => {
	const res = await fetchWithAuth(`${API}/api/profile/bio`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Failed to update bio");
	}

	return data;
};

const updateProfilePicture = async (
	payload: UpdateProfilePicturePayload,
): Promise<UpdateProfilePictureResponse> => {
	const formData = new FormData();
	formData.append("avatar", {
		uri: payload.uri,
		name: payload.name ?? `avatar-${Date.now()}.jpg`,
		type: payload.type ?? "image/jpeg",
	} as never);

	const res = await fetchWithAuth(`${API}/api/profile/picture`, {
		method: "PUT",
		body: formData,
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Failed to update profile picture");
	}

	return data;
};

const updatePassword = async (
	payload: UpdatePasswordPayload,
): Promise<ProfileMessageResponse> => {
	const res = await fetchWithAuth(`${API}/api/profile/password`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Failed to change password");
	}

	return data;
};

const deleteAccount = async (): Promise<ProfileMessageResponse> => {
	const res = await fetchWithAuth(`${API}/api/profile/account`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Failed to delete account");
	}

	return data;
};

export {
	deleteAccount,
	getProfile,
	updateBio,
	updatePassword,
	updateProfilePicture,
	updateUsername,
};
