import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import shuffle from "lodash.shuffle";
import { useEffect, useState } from "react";
import {
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import {
	getRecommendedSpaces,
	getTrendingSpaces,
	type Space,
} from "../../api/Spaces";
import { useTopic } from "../../context/SpaceContext";
import type { TopicItem } from "../../types/types";

const styles = StyleSheet.create({
	headerBackground: {
		paddingTop: 30,
		backgroundColor: "#27A6FD",
	},
	logoText: {
		color: "white",
		fontSize: 36,
		fontFamily: "Montserrat-ExtraBoldItalic",
		flex: 1,
	},
	header: {
		flexDirection: "row",
		paddingHorizontal: 15,
	},
});

const Item = ({
	topicItems,
	index,
	placement,
	onPress,
}: {
	topicItems: TopicItem;
	index: number;
	placement: "adaptive" | "fixed";
	onPress: () => void;
}) => {
	const backgroundColors = [
		"#FFD60A", // vivid yellow
		"#FF4FA3", // vibrant pink
		"#00CFE8", // strong cyan
		"#8A5CF6", // bright purple
		"#2DD36F", // fresh green
	];

	const tagColors = shuffle([
		"#E03131", // deep red
		"#F76707", // strong orange
		"#1C7ED6", // bold blue
		"#5F3DC4", // deep violet
		"#C2255C", // magenta
		"#364FC7", // indigo
	]);
	const colorChance = backgroundColors[index % backgroundColors.length];
	const desc = topicItems.description.slice(
		0,
		placement === "adaptive" ? 45 : 55,
	);
	const slicedTopic = topicItems.topic.slice(
		0,
		placement === "adaptive" ? 35 : 45,
	);
	return (
		<View
			style={{
				backgroundColor: colorChance,
				padding: 20,
				marginVertical: 8,
				marginHorizontal: placement === "adaptive" ? 8 : 4,
				borderColor: "black",
				borderWidth: 2,
				borderBottomWidth: 5,
				borderRightWidth: 5,
				width: placement === "fixed" ? 300 : "auto",
			}}
		>
			<TouchableOpacity activeOpacity={1} onPress={onPress}>
				<Text
					style={{
						fontSize: 20,
						fontFamily: "Montserrat-ExtraBold",
						paddingBottom: 4,
					}}
				>
					{slicedTopic}
					{slicedTopic.trimEnd().endsWith(".") ||
					slicedTopic === topicItems.topic
						? ""
						: "..."}
				</Text>

				<Text
					style={{
						fontSize: 16,
						fontFamily: "Montserrat-Medium",
						color: "black",
						flexGrow: 1,
					}}
				>
					{desc}
					{desc.trimEnd().endsWith(".") || desc === topicItems.description
						? ""
						: "..."}
				</Text>

				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<View
						style={{
							marginRight: "auto",
							flexDirection: "row",
							paddingVertical: 4,
						}}
					>
						<Text>By @{topicItems.author}</Text>
					</View>

					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<FontAwesomeFreeSolid name="user" size={15} color="#000000" />
						<Text style={{ marginLeft: 4, fontFamily: "Montserrat-Bold" }}>
							{topicItems.count}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
			<ScrollView
				showsVerticalScrollIndicator={false}
				horizontal
				nestedScrollEnabled
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ flexDirection: "row", alignItems: "center" }}
			>
				{topicItems.tags.map((tag, tagIndex) => {
					const tagColor = tagColors[tagIndex % tagColors.length];

					return (
						<View
							key={tag}
							style={{
								backgroundColor: tagColor,
								paddingVertical: 2,
								paddingHorizontal: 6,
								borderRadius: 4,
								marginRight: 4,
							}}
						>
							<Text
								style={{
									color: "white",
									fontSize: 12,
									fontFamily: "Montserrat-SemiBold",
								}}
							>
								#{tag}
							</Text>
						</View>
					);
				})}
			</ScrollView>
		</View>
	);
};

const mapSpaceToTopicItem = (space: Space): TopicItem => ({
	id: space.space_id,
	topic: space.title,
	description: space.description,
	author: space.creator.username,
	count: space.participant_count,
	tags: space.tags.map((tag) => tag.tag_name),
});

const Home = () => {
	const [trendingTopics, setTrendingTopics] = useState<TopicItem[]>([]);
	const [recommendedTopics, setRecommendedTopics] = useState<TopicItem[]>([]);
	const [isTrendingLoading, setIsTrendingLoading] = useState(true);
	const [isRecommendedLoading, setIsRecommendedLoading] = useState(true);
	const [trendingError, setTrendingError] = useState<string | null>(null);
	const [recommendedError, setRecommendedError] = useState<string | null>(null);

	const { setTopicId } = useTopic();

	useEffect(() => {
		const loadSpaces = async () => {
			try {
				setIsTrendingLoading(true);
				setTrendingError(null);
				setIsRecommendedLoading(true);
				setRecommendedError(null);

				const trendingSpaces = await getTrendingSpaces();
				setTrendingTopics(trendingSpaces.map(mapSpaceToTopicItem));

				const recommendedSpaces = await getRecommendedSpaces();
				setRecommendedTopics(recommendedSpaces.map(mapSpaceToTopicItem));
			} catch (error) {
				setTrendingError(
					error instanceof Error
						? error.message
						: "Failed to load trending spaces",
				);
				setRecommendedError(
					error instanceof Error
						? error.message
						: "Failed to load recommended spaces",
				);
			} finally {
				setIsTrendingLoading(false);
				setIsRecommendedLoading(false);
			}
		};

		loadSpaces();
	}, []);

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			showsHorizontalScrollIndicator={false}
			style={{ flex: 1 }}
		>
			<View style={styles.headerBackground}>
				{/*Header*/}
				<View style={styles.header}>
					<Text style={styles.logoText}>
						space<Text style={{ color: "yellow" }}>7</Text>
					</Text>
				</View>
			</View>
			<View
				style={{ backgroundColor: "#F0F0F0", paddingHorizontal: 0, flex: 1 }}
			>
				<View
					style={{
						flexDirection: "row",
						paddingVertical: 10,
						marginTop: 10,
						paddingHorizontal: 15,
					}}
				>
					<View
						style={{
							paddingVertical: 3,
							paddingHorizontal: 8,
							backgroundColor: "#FB3498",
							marginRight: "auto",
							borderColor: "black",
							borderWidth: 3,
							borderRadius: 8,
						}}
					>
						<Text
							style={{
								fontFamily: "Montserrat-Bold",
								fontSize: 18,
								color: "black",
							}}
						>
							Trending Topics
						</Text>
					</View>
				</View>
				<View
					style={{
						borderColor: "black",
						marginLeft: 5,
					}}
				>
					{isTrendingLoading ? (
						<Text
							style={{
								paddingHorizontal: 12,
								paddingVertical: 16,
								fontFamily: "Montserrat-Medium",
								color: "black",
							}}
						>
							Loading trending spaces...
						</Text>
					) : trendingError ? (
						<Text
							style={{
								paddingHorizontal: 12,
								paddingVertical: 16,
								fontFamily: "Montserrat-Medium",
								color: "#C2255C",
							}}
						>
							{trendingError}
						</Text>
					) : (
						<FlatList
							data={trendingTopics}
							horizontal
							showsHorizontalScrollIndicator={false}
							showsVerticalScrollIndicator={false}
							renderItem={({ item, index }) => (
								<Item
									topicItems={item}
									index={index}
									onPress={() => setTopicId(item.id)}
									placement="fixed"
								/>
							)}
							keyExtractor={(item) => item.id}
							ListEmptyComponent={
								<Text
									style={{
										paddingHorizontal: 12,
										paddingVertical: 16,
										fontFamily: "Montserrat-Medium",
										color: "black",
									}}
								>
									No trending spaces yet.
								</Text>
							}
						/>
					)}
				</View>
				<View
					style={{
						flexDirection: "row",
						paddingVertical: 10,
						paddingHorizontal: 15,
					}}
				>
					<View
						style={{
							paddingVertical: 3,
							paddingHorizontal: 8,
							backgroundColor: "#FDFDFB",
							marginRight: "auto",
							borderColor: "black",
							borderWidth: 3,
							borderRadius: 8,
						}}
					>
						<Text
							style={{
								fontFamily: "Montserrat-Bold",
								fontSize: 18,
								color: "black",
							}}
						>
							Recommended for you
						</Text>
					</View>
				</View>
				<View
					style={{
						flex: 1,
					}}
				>
					{isRecommendedLoading && (
						<Text
							style={{
								paddingHorizontal: 12,
								paddingVertical: 16,
								fontFamily: "Montserrat-Medium",
								color: "black",
							}}
						>
							Loading recommended spaces...
						</Text>
					)}
					{recommendedError && (
						<Text
							style={{
								paddingHorizontal: 12,
								paddingVertical: 16,
								fontFamily: "Montserrat-Medium",
								color: "#C2255C",
							}}
						>
							{recommendedError}
						</Text>
					)}
					<FlatList
						style={{ marginBottom: 80 }}
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}
						data={recommendedTopics}
						renderItem={({ item, index }) => (
							<Item
								topicItems={item}
								index={index}
								onPress={() => setTopicId(item.id)}
								placement="adaptive"
							/>
						)}
						keyExtractor={(item) => item.id}
						scrollEnabled={false}
						ListEmptyComponent={
							<Text
								style={{
									paddingHorizontal: 12,
									paddingVertical: 16,
									fontFamily: "Montserrat-Medium",
									color: "black",
								}}
							>
								No recommendations yet.
							</Text>
						}
					/>
				</View>
			</View>
		</ScrollView>
	);
};

export default Home;
