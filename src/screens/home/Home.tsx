import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import shuffle from "lodash.shuffle";
import { useState } from "react";
import {
	FlatList,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import type { TopicItem } from "../../types";

const styles = StyleSheet.create({
	headerBackground: {
		paddingTop: 30,
		backgroundColor: "#27A6FD",
	},
	logoText: {
		color: "black",
		fontSize: 36,
		fontFamily: "Montserrat-ExtraBold",
		flex: 1,
	},
	searchBar: {
		marginTop: 5,
		marginBottom: 12,
		marginHorizontal: 25,
		padding: 1.7,
		paddingVertical: 2,
		backgroundColor: "white",
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 12,
		borderWidth: 3,
		borderColor: "black",
	},
	inputFocused: {
		borderRightWidth: 5,
		borderBottomWidth: 5,
	},
	searchIcon: {
		paddingHorizontal: 10,
		paddingVertical: 3,
		fontSize: 25,
	},
	enterIcon: {
		backgroundColor: "#FDD827",
		borderWidth: 3,
		borderColor: "black",
		borderRadius: 16,
		borderBottomWidth: 5,
		borderRightWidth: 5,
		borderTopWidth: 3,
		borderLeftWidth: 3,
		position: "relative",
		bottom: 2,
	},
	buttonfocused: {
		borderBottomWidth: 3,
		borderRightWidth: 3,
	},
	header: {
		flexDirection: "row",
		paddingHorizontal: 25,
	},
});

const Item = ({
	topicItems,
	index,
	placement,
}: {
	topicItems: TopicItem;
	index: number;
	placement: "adaptive" | "fixed";
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
	const desc = topicItems.description.slice(0, 128);

	return (
		<View
			style={{
				backgroundColor: colorChance,
				padding: 20,
				marginVertical: 8,
				marginHorizontal: placement === "adaptive" ? 8 : 4,
				borderRadius: 12,
				borderColor: "black",
				borderWidth: 2,
				width: placement === "fixed" ? 300 : "auto",
			}}
		>
			<Text
				style={{
					fontSize: 24,
					fontFamily: "Montserrat-ExtraBold",
					paddingBottom: 4,
				}}
			>
				{topicItems.topic}
			</Text>

			<Text
				style={{ fontSize: 14, fontFamily: "Montserrat-Medium", flexGrow: 1 }}
			>
				{desc}
				{desc.trimEnd().endsWith(".") ? "" : "..."}
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

			<View style={{ flexDirection: "row", alignItems: "center" }}>
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
			</View>
		</View>
	);
};

const DATA: TopicItem[] = [
	{
		id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
		topic: "React Native FlatList Performance",
		description:
			"Optimizing large lists in React Native by improving rendering efficiency, reducing unnecessary re-renders, and applying techniques that ensure smooth and responsive scrolling even with large datasets.",
		author: "Alex Johnson",
		count: 128,
		tags: ["react-native", "performance", "flatlist"],
	},
	{
		id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
		topic: "Understanding JavaScript Closures",
		description:
			"Explanation of closures with practical examples and common interview questions.",
		author: "Priya Sharma",
		count: 76,
		tags: ["javascript", "functions", "closures"],
	},
	{
		id: "58694a0f-3da1-471f-bd96-145571e29d72",
		topic: "Introduction to Docker",
		description:
			"Basic concepts of containers, Docker images, and container orchestration.",
		author: "Daniel Lee",
		count: 54,
		tags: ["docker", "containers", "devops"],
	},
	{
		id: "bd7acbea-c1b1-46c2-aed5-3bjad53abb28ba",
		topic: "Neural Networks Basics",
		description:
			"Understanding perceptrons, activation functions, and forward propagation.",
		author: "Sara Kim",
		count: 92,
		tags: ["machine-learning", "neural-networks", "ai"],
	},
	{
		id: "3ac68afc-c605-48d3-a4f8-nljfbd91aa97f63",
		topic: "REST vs GraphQL",
		description:
			"Comparison between REST APIs and GraphQL for modern web development.",
		author: "Michael Brown",
		count: 61,
		tags: ["api", "graphql", "rest"],
	},
	{
		id: "58694a0f-3da1-471f-bd96-nlj145571e29d72",
		topic: "Building Authentication Systems",
		description:
			"Implementing login, JWT authentication, and secure session handling.",
		author: "Ananya Iyer",
		count: 147,
		tags: ["authentication", "security", "backend"],
	},
	{
		id: "bd7acbea-c1b1-46c2-aed5-3bbijhjad53abb28ba",
		topic: "CSS Flexbox Layout Guide",
		description: "Practical guide to mastering flexbox for responsive layouts.",
		author: "David Miller",
		count: 83,
		tags: ["css", "flexbox", "frontend"],
	},
	{
		id: "3ac68afc-c605-48d3-a4f8-fbdnj91aa97f63",
		topic: "LangChain for LLM Applications",
		description:
			"Using LangChain to build AI powered applications and workflows.",
		author: "Rohit Mehta",
		count: 39,
		tags: ["llm", "langchain", "ai"],
	},
	{
		id: "58694a0f-3da1-471f-bd96-14nj5571e29d72",
		topic: "Understanding Git Internals",
		description: "How Git stores commits, trees, and objects internally.",
		author: "Emily Carter",
		count: 58,
		tags: ["git", "version-control", "development"],
	},
];

const Home = () => {
	const [focused, setFocused] = useState(false);
	const [pressed, setPressed] = useState(false);

	return (
		<View style={{ flex: 1 }}>
			<View style={styles.headerBackground}>
				{/*Header*/}
				<View style={styles.header}>
					<Text style={styles.logoText}>space7</Text>
					<FontAwesomeFreeSolid
						style={{
							padding: 5,
							backgroundColor: "#FDD827",
							borderRadius: 8,
							borderWidth: 3,
							borderColor: "black",
							marginHorizontal: 5,
							paddingHorizontal: 10,
						}}
						name="bell"
						size={25}
						color="#000000"
					/>
					<FontAwesomeFreeSolid
						style={{
							padding: 5,
							backgroundColor: "#FB3498",
							borderRadius: 8,
							borderWidth: 3,
							borderColor: "black",
							marginLeft: 5,
							paddingHorizontal: 10,
						}}
						name="bars"
						size={25}
						color="#000000"
					/>
				</View>
				{/*Search Bar*/}
				<View style={[styles.searchBar, focused && styles.inputFocused]}>
					<FontAwesomeFreeSolid
						name="search"
						size={20}
						color="#000000"
						style={styles.searchIcon}
					/>
					<TextInput
						style={{
							fontFamily: "Montserrat-Medium",
							fontSize: 15,
							flex: 1,
							color: "black",
						}}
						placeholder="Search topics, users, or posts..."
						placeholderTextColor="#7f7d7dff"
						onFocus={() => setFocused(true)}
						onBlur={() => setFocused(false)}
					/>
					<View
						style={[
							{
								borderTopWidth: 3,
								borderLeftWidth: 3,
								borderTopColor: "transparent",
								borderLeftColor: "transparent",
							},
							pressed && { borderTopWidth: 5, borderLeftWidth: 5 },
						]}
					>
						<TouchableOpacity
							activeOpacity={1}
							onPressIn={() => setPressed(true)}
							onPressOut={() => setPressed(false)}
						>
							<View style={[styles.enterIcon, pressed && styles.buttonfocused]}>
								<FontAwesomeFreeSolid
									name="arrow-right"
									size={20}
									color="#000000"
									style={styles.searchIcon}
								/>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			<View
				style={{ backgroundColor: "#F0F0F0", paddingHorizontal: 23, flex: 1 }}
			>
				<View
					style={{ flexDirection: "row", paddingVertical: 10, marginTop: 10 }}
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
					<View
						style={{
							paddingVertical: 3,
							paddingHorizontal: 8,
							backgroundColor: "#55D569",
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
							See All
						</Text>
					</View>
				</View>
				<View style={{ borderColor: "black", borderWidth: 3, borderRadius: 8 }}>
					<FlatList
						data={DATA}
						horizontal
						renderItem={({ item, index }) => (
							<Item topicItems={item} index={index} placement="fixed" />
						)}
						keyExtractor={(item) => item.id}
					/>
				</View>
				<View style={{ flexDirection: "row", paddingVertical: 10 }}>
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
					<View
						style={{
							paddingVertical: 3,
							paddingHorizontal: 8,
							backgroundColor: "#26A9FE",
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
							See All
						</Text>
					</View>
				</View>
				<View
					style={{
						flex: 1,
						borderColor: "black",
						borderWidth: 3,
						borderRadius: 8,
						marginBottom: 50,
					}}
				>
					<FlatList
						data={DATA}
						renderItem={({ item, index }) => (
							<Item topicItems={item} index={index} placement="adaptive" />
						)}
						keyExtractor={(item) => item.id}
					/>
				</View>
			</View>
		</View>
	);
};

export default Home;
