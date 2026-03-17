import { Text, TouchableOpacity } from "react-native";
import type { SearchResult } from "../../api/Search";
import { styles } from "./styles";

type SearchResultItemProps = {
	result: SearchResult;
	onSelectTopic: (topicId: string) => void;
};

export const SearchResultItem = ({
	result,
	onSelectTopic,
}: SearchResultItemProps) => {
	return (
		<TouchableOpacity
			onPress={() => onSelectTopic(result.space_id)}
			style={styles.resultItem}
		>
			<Text style={styles.resultTitle}>{result.title}</Text>
			<Text style={styles.resultDescription}>{result.description}</Text>
		</TouchableOpacity>
	);
};
