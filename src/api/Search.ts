import { API } from "../constants/Network";

type Creator = {
	user_id: string;
	username: string;
	profile_picture: string;
};

type Tags = {
	tag_id: number;
	tag_name: string;
};

export type SearchResult = {
	space_id: string;
	title: string;
	description: string;
	visibility?: "public" | "private";
	creator: Creator;
	participant_count: number;
	tags: Tags[];
};

const searchSpaces = async (query: string): Promise<SearchResult[]> => {
	const res = await fetch(
		`${API}/api/spaces/search?q=${encodeURIComponent(query)}`,
		{
			method: "GET",
		},
	);

	if (!res.ok) {
		throw new Error("Failed to search spaces");
	}

	const data = await res.json();
	return data;
};

const searchSpacesByTag = async (tag: string): Promise<SearchResult[]> => {
	const res = await fetch(`${API}/api/spaces/tag/${tag}`, {
		method: "GET",
	});

	if (!res.ok) {
		throw new Error("Failed to search spaces by tag");
	}

	const data = await res.json();
	return data;
};

export const SearchAPI = async (
	query: string,
): Promise<{
	tagSearchResults: SearchResult[];
	generalSearchResults: SearchResult[];
}> => {
	const trimmedQuery = query.trim();

	if (!trimmedQuery) {
		return { tagSearchResults: [], generalSearchResults: [] };
	}

	const tagSearchResults = await searchSpacesByTag(trimmedQuery);
	const generalSearchResults = await searchSpaces(trimmedQuery);

	const onlyPublicTagResults = tagSearchResults.filter(
		(space) => !space.visibility || space.visibility === "public",
	);
	const onlyPublicGeneralResults = generalSearchResults.filter(
		(space) => !space.visibility || space.visibility === "public",
	);

	return {
		tagSearchResults: onlyPublicTagResults,
		generalSearchResults: onlyPublicGeneralResults,
	};
};
