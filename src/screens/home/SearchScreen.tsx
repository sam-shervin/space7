import { useEffect, useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import type { SearchResult } from "../../api/Search";
import { SearchAPI } from "../../api/Search";

import { useTopic } from "../../context/SpaceContext";

export const SearchScreen = ({ query }: { query: string }) => {
	const { setTopicId } = useTopic();
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

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
			style={{ flex: 1 }}
		>
			<View>
				{/* give better UI to show that these are search results */}
				<Text
					style={{
						fontSize: 18,
						fontWeight: "bold",
						marginBottom: 10,
						paddingTop: 10,
					}}
				>
					Search Results for "{query}"
				</Text>
				{generalSearchResults.length > 0 && (
					<View
						style={{
							borderColor: "#ccc",
							paddingTop: 5,
							borderWidth: 1,
							paddingHorizontal: 10,
						}}
					>
						<Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
							General Search Results
						</Text>
						{generalSearchResults.map((result) => (
							<TouchableOpacity
								onPress={() => setTopicId(result.space_id)}
								key={result.space_id}
								style={{
									padding: 10,
									borderBottomWidth: 1,
									borderBottomColor: "#ccc",
									backgroundColor: "#e8e7e9ff",
								}}
							>
								<Text style={{ fontSize: 14, fontWeight: "bold" }}>
									{result.title}
								</Text>
								<Text style={{ fontSize: 12, color: "#666" }}>
									{result.description}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				)}

				{tagSearchResults.length > 0 && (
					<View
						style={{
							marginBottom: 20,
							borderWidth: 1,
							borderColor: "#ccc",
							paddingTop: 5,
							paddingHorizontal: 10,
						}}
					>
						<Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
							Tag Search Results
						</Text>
						{tagSearchResults.map((result) => (
							<TouchableOpacity
								onPress={() => setTopicId(result.space_id)}
								key={result.space_id}
								style={{
									padding: 10,
									borderBottomWidth: 1,
									borderBottomColor: "#ccc",
									backgroundColor: "#e8e7e9ff",
								}}
							>
								<Text style={{ fontSize: 14, fontWeight: "bold" }}>
									{result.title}
								</Text>
								<Text style={{ fontSize: 12, color: "#666" }}>
									{result.description}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				)}
			</View>
		</KeyboardAvoidingView>
	);
};
