import { SearchFeature } from "../../components/search-feature";
import { useTopic } from "../../context/SpaceContext";

export const SearchScreen = ({ query }: { query: string }) => {
	const { setTopicId } = useTopic();

	return <SearchFeature query={query} onSelectTopic={setTopicId} />;
};
