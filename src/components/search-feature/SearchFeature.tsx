import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { SearchResultsSection } from "./SearchResultsSection";
import { styles } from "./styles";
import type { SearchFeatureProps } from "./types";
import { useSearchResults } from "./useSearchResults";

export const SearchFeature = ({ query, onSelectTopic }: SearchFeatureProps) => {
	const { generalSearchResults, tagSearchResults } = useSearchResults(query);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
			style={styles.container}
		>
			<View style={styles.content}>
				<Text style={styles.heading}>Search Results for "{query}"</Text>
				<SearchResultsSection
					title="General Search Results"
					results={generalSearchResults}
					onSelectTopic={onSelectTopic}
				/>
				<SearchResultsSection
					title="Tag Search Results"
					results={tagSearchResults}
					onSelectTopic={onSelectTopic}
					isTagSection
				/>
			</View>
		</KeyboardAvoidingView>
	);
};
