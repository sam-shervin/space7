const API = process.env.SERVER_ENDPOINT ?? "";

export type TrendingSpaceCreator = {
	user_id: string;
	username: string;
	profile_picture: string;
};

export type TrendingSpaceTag = {
	tag_id: number;
	tag_name: string;
};

export type TrendingSpace = {
	space_id: string;
	title: string;
	description: string;
	visibility: "public" | "private";
	creator: TrendingSpaceCreator;
	participant_count: number;
	tags: TrendingSpaceTag[];
};

type GetTrendingSpacesOptions = {
	limit?: number;
};

const getTrendingSpaces = async (
	options: GetTrendingSpacesOptions = {},
): Promise<TrendingSpace[]> => {
	const { limit = 10 } = options;
	const query = typeof limit === "number" ? `?limit=${limit}` : "";

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

export { getTrendingSpaces };
