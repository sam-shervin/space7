import { useEffect, useState } from "react";
import type { SearchResult } from "../../api/Search";
import { SearchAPI } from "../../api/Search";

type UseSearchResultsReturn = {
	generalSearchResults: SearchResult[];
	tagSearchResults: SearchResult[];
};

export const useSearchResults = (query: string): UseSearchResultsReturn => {
	const [generalSearchResults, setGeneralSearchResults] = useState<
		SearchResult[]
	>([]);
	const [tagSearchResults, setTagSearchResults] = useState<SearchResult[]>([]);

	useEffect(() => {
		const fetchSearchResults = async () => {
			try {
				const results = await SearchAPI(query);
				setGeneralSearchResults(results.generalSearchResults);
				setTagSearchResults(results.tagSearchResults);
			} catch (error) {
				console.error("Error fetching search results:", error);
			}
		};

		if (query.length > 0) {
			fetchSearchResults();
		} else {
			setGeneralSearchResults([]);
			setTagSearchResults([]);
		}
	}, [query]);

	return {
		generalSearchResults,
		tagSearchResults,
	};
};
