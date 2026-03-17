import { Text, View } from "react-native";
import type { SearchResult } from "../../api/Search";
import { SearchResultItem } from "./SearchResultItem";
import { styles } from "./styles";

type SearchResultsSectionProps = {
	title: string;
	results: SearchResult[];
	onSelectTopic: (topicId: string) => void;
	isTagSection?: boolean;
};

export const SearchResultsSection = ({
	title,
	results,
	onSelectTopic,
	isTagSection = false,
}: SearchResultsSectionProps) => {
	if (results.length === 0) {
		return null;
	}

	return (
		<View style={isTagSection ? styles.tagSection : styles.section}>
			<Text style={styles.sectionTitle}>{title}</Text>
			{results.map((result) => (
				<SearchResultItem
					key={result.space_id}
					result={result}
					onSelectTopic={onSelectTopic}
				/>
			))}
		</View>
	);
};
