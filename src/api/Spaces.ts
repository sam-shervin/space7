import { fetchWithAuth } from "./fetchWithAuth";
import { API } from "../constants/Network";

export type SpaceCreator = {
	user_id: string;
	username: string;
	profile_picture: string;
};

export type SpaceTag = {
	tag_id: number;
	tag_name: string;
};

export type Space = {
	space_id: string;
	title: string;
	description: string;
	visibility: "public" | "private";
	creator: SpaceCreator;
	participant_count: number;
	tags: SpaceTag[];
};

type GetSpacesOptions = {
	limit?: number;
	visibility?: Space["visibility"];
};

type CreateSpacePayload = {
	title: string;
	description: string;
	visibility: Space["visibility"];
	hashtags: string[];
};

type JoinSpacePayload = {
	invite_code?: string;
};

const buildQuery = (options: GetSpacesOptions = {}) => {
	const params: string[] = [];

	if (typeof options.limit === "number") {
		params.push(`limit=${options.limit}`);
	}

	if (options.visibility) {
		params.push(`visibility=${options.visibility}`);
	}

	if (params.length === 0) {
		return "";
	}

	return `?${params.join("&")}`;
};

const getTrendingSpaces = async (
	options: GetSpacesOptions = {},
): Promise<Space[]> => {
	const query = buildQuery({ limit: options.limit ?? 10 });

	const res = await fetch(`${API}/api/spaces/trending${query}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Failed to fetch trending spaces");
	}

	return data;
};

const getRecommendedSpaces = async (
	options: GetSpacesOptions = {},
): Promise<Space[]> => {
	const query = buildQuery({ limit: options.limit ?? 10 });

	const res = await fetchWithAuth(`${API}/api/spaces/recommended${query}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Failed to fetch recommended spaces");
	}

	return data;
};

const getMySpaces = async (
	options: GetSpacesOptions = {},
): Promise<Space[]> => {
	const query = buildQuery({ visibility: options.visibility });

	const res = await fetchWithAuth(`${API}/api/spaces/my${query}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Failed to fetch my spaces");
	}

	return data;
};

const createSpace = async (payload: CreateSpacePayload): Promise<Space> => {
	const res = await fetchWithAuth(`${API}/api/spaces`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Failed to create space");
	}

	return data;
};


const getSpaceById = async (spaceId: string): Promise<Space> => {
	const res = await fetchWithAuth(`${API}/api/spaces/${spaceId}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Failed to fetch space");
	}

	return data;
};

const joinSpace = async (
	spaceId: string,
	payload: JoinSpacePayload = {},
): Promise<{ message: string }> => {
	const res = await fetchWithAuth(`${API}/api/spaces/${spaceId}/join`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || "Failed to join space");
	}

	return data;
};

export {
	getTrendingSpaces,
	getRecommendedSpaces,
	getMySpaces,
	createSpace,
	getSpaceById,
	joinSpace,
};
