import FontAwesomeFreeSolid from "@react-native-vector-icons/fontawesome-free-solid";
import Lucide from "@react-native-vector-icons/lucide";
import shuffle from "lodash.shuffle";
import {
	FlatList,
	Image,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import type { TopicItem } from "../../types/types";

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
	const desc = topicItems.description.slice(
		0,
		placement === "adaptive" ? 45 : 55,
	);
	const slicedTopic = topicItems.topic.slice(
		0,
		placement === "adaptive" ? 20 : 25,
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
			<Text
				style={{
					fontSize: 20,
					fontFamily: "Montserrat-ExtraBold",
					paddingBottom: 4,
				}}
			>
				{slicedTopic}
				{slicedTopic.trimEnd().endsWith(".") || slicedTopic === topicItems.topic
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

const MyProfile = () => {
	const { logout } = useAuth();
	const username: string = "goofygen";
	const imageUrl =
		"https://instagram.fmaa6-1.fna.fbcdn.net/v/t51.82787-15/624732511_17861455719591590_9029459131273544920_n.jpg?stp=dst-jpg_s320x320_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby41NDEuYzIifQ&_nc_ht=instagram.fmaa6-1.fna.fbcdn.net&_nc_cat=1&_nc_oc=Q6cZ2QEGxGfXkVHMlg3mH-uk2_HxocXWW8oW5idEqZ_BRfbMg17HsD3HduuEGtrexMS5FFc&_nc_ohc=v9RZlKdHAbEQ7kNvwE-OsL0&_nc_gid=2T2EV-Rz_bbNCtTFLXncLw&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfxaKzAWpvSw1AqRx54zCBsSseDaFeAGLQqA7yopTEej0A&oe=69B094F4&_nc_sid=8b3546";
	const apiText: string =
		"Chess in the brain, dance in the destiny.♟️ \nLose the game… drop the move, drop the groove.";
	const description = apiText?.replace(/\\n/g, "\n");
	return (
		<>
			<View
				style={{
					backgroundColor: "#27A6FD",
					borderBottomWidth: 3,
					paddingHorizontal: 25,
					paddingVertical: 20,
					flexDirection: "row",
				}}
			>
				<Text
					style={{
						fontFamily: "Montserrat-ExtraBold",
						fontSize: 32,
						marginRight: "auto",
					}}
				>
					My Profile
				</Text>
				<FontAwesomeFreeSolid
					name="bars"
					size={28}
					color="#000000"
					style={{
						borderWidth: 3,
						borderColor: "black",
						borderRadius: 8,
						paddingHorizontal: 5,
						alignSelf: "center",
						backgroundColor: "#FDD827",
						borderBottomWidth: 5,
						borderRightWidth: 5,
					}}
				/>
				<TouchableOpacity
					onPress={logout}
					style={{
						borderWidth: 3,
						borderColor: "black",
						borderRadius: 8,
						paddingHorizontal: 12,
						paddingVertical: 6,
						alignSelf: "center",
						backgroundColor: "#FF4FA3",
						borderBottomWidth: 5,
						borderRightWidth: 5,
						marginLeft: 10,
					}}
				>
					<Text style={{ fontFamily: "Montserrat-Bold", color: "black" }}>
						Logout
					</Text>
				</TouchableOpacity>
			</View>
			<ScrollView
				style={{ backgroundColor: "#FDD827", flex: 1 }}
				contentContainerStyle={{ flexGrow: 1 }}
			>
				<View style={{ flexDirection: "row", zIndex: 0 }}>
					<Lucide
						style={{
							position: "absolute",
							top: 30,
							left: 70,
							transform: [{ scale: 1 }],
						}}
						name="sparkle"
						size={20}
						color="#000000"
					/>
					<Lucide
						style={{
							position: "absolute",
							top: 60,
							left: 30,
							transform: [{ scale: 1 }],
						}}
						name="sparkle"
						size={30}
						color="#000000"
					/>
					<Lucide
						style={{
							position: "absolute",
							top: 20,
							left: 120,
							transform: [{ scale: 1 }],
						}}
						name="sparkle"
						size={30}
						color="#000000"
					/>
					<Lucide
						style={{
							position: "absolute",
							top: 60,
							left: 100,
							transform: [{ scale: 1 }],
						}}
						name="sparkle"
						size={40}
						color="#000000"
					/>
					<Lucide
						style={{
							position: "absolute",
							top: 20,
							left: 290,
							transform: [{ scale: 1 }],
						}}
						name="sparkle"
						size={15}
						color="#000000"
					/>
					<Lucide
						style={{
							position: "absolute",
							top: 30,
							left: 350,
							transform: [{ scale: 1 }],
						}}
						name="sparkle"
						size={25}
						color="#000000"
					/>
					<Lucide
						style={{
							position: "absolute",
							top: 50,
							left: 290,
							transform: [{ scale: 1 }],
						}}
						name="sparkle"
						size={35}
						color="#000000"
					/>
					<Lucide
						style={{
							position: "absolute",
							top: 70,
							left: 330,
							transform: [{ scale: 1 }],
						}}
						name="sparkle"
						size={35}
						color="#000000"
					/>
				</View>
				<Image
					source={{ uri: imageUrl }}
					style={{
						width: 150,
						height: 150,
						borderRadius: 150,
						alignSelf: "center",
						top: 40,
						borderWidth: 5,
						borderColor: "#181805ff",
						resizeMode: "cover",
						zIndex: 2,
						position: "absolute",
					}}
				/>
				<View
					style={{
						backgroundColor: "#ffffff",
						zIndex: 0,
						flex: 1,
						flexDirection: "column",
						flexGrow: 1,
						height: "100%",
						borderTopEndRadius: 50,
						borderTopStartRadius: 50,
						marginTop: 120,
						alignContent: "center",
						alignItems: "center",
					}}
				>
					<Text
						style={{
							fontFamily: "Montserrat-Bold",
							fontSize: 30,
							marginTop: 70,
						}}
					>
						{username}
					</Text>
					<View
						style={{
							backgroundColor: "#fff41dff",
							borderRadius: 20,
							borderWidth: 2,
							marginHorizontal: 20,
							borderBottomWidth: 5,
							borderRightWidth: 5,
						}}
					>
						<Text
							style={{
								fontFamily: "Montserrat-Regular",
								fontSize: 16,
								padding: 10,
							}}
						>
							{description}
						</Text>
					</View>
					<View
						style={{
							flexDirection: "row",
							marginTop: 10,
							alignItems: "flex-start",
							gap: 10,
						}}
					>
						<View
							style={{
								backgroundColor: "#2DD36F",
								alignItems: "center",
								padding: 10,
								borderRadius: 10,
								paddingHorizontal: 35,
								borderWidth: 2,
								borderRightWidth: 5,
								borderBottomWidth: 5,
							}}
						>
							<FontAwesomeFreeSolid
								style={{
									position: "absolute",
									zIndex: 4,
									alignSelf: "flex-start",
									top: 11,
									left: 10,
								}}
								name="globe"
								size={28}
								color="#000000"
							/>

							<Text
								style={{
									fontFamily: "Montserrat-Bold",
									fontSize: 45,
									marginVertical: -10,
								}}
							>
								24
							</Text>
							<Text style={{ fontFamily: "Montserrat-SemiBold", fontSize: 24 }}>
								Created
							</Text>
						</View>
						<View
							style={{
								backgroundColor: "yellow",
								alignItems: "center",
								paddingLeft: 20,
								padding: 10,
								borderRadius: 10,
								paddingHorizontal: 10,
								borderWidth: 2,
								borderRightWidth: 5,
								borderBottomWidth: 5,
							}}
						>
							<FontAwesomeFreeSolid
								style={{
									position: "absolute",
									zIndex: 4,
									alignSelf: "flex-start",
									top: 10,
									left: 10,
								}}
								name="pen"
								size={28}
								color="#000000"
							/>
							<Text
								style={{
									fontFamily: "Montserrat-Bold",
									fontSize: 45,
									marginVertical: -10,
								}}
							>
								27
							</Text>
							<Text style={{ fontFamily: "Montserrat-SemiBold", fontSize: 24 }}>
								Participated
							</Text>
						</View>
					</View>
					<View
						style={{
							flexDirection: "row",
							marginTop: 10,
							alignItems: "flex-start",
							backgroundColor: "#0a26b1ff",
							borderRadius: 10,
							gap: 10,
						}}
					>
						<View
							style={{
								backgroundColor: "#ffffff",
								alignItems: "center",
								padding: 5,
								borderRadius: 10,
								paddingHorizontal: 30,
								borderWidth: 2,
								borderRightWidth: 5,
								borderBottomWidth: 5,
							}}
						>
							<Text style={{ fontFamily: "Montserrat-Bold", fontSize: 32 }}>
								Public
							</Text>
						</View>
						<View
							style={{
								backgroundColor: "#f76db0ff",
								alignItems: "center",
								padding: 5,
								borderRadius: 10,
								paddingHorizontal: 30,
								borderWidth: 2,
								borderRightWidth: 5,
								borderBottomWidth: 5,
							}}
						>
							<Text style={{ fontFamily: "Montserrat-Bold", fontSize: 32 }}>
								Private
							</Text>
						</View>
					</View>
					<View
						style={{
							flex: 1,
							paddingHorizontal: 10,
						}}
					>
						<FlatList
							data={DATA}
							renderItem={({ item, index }) => (
								<Item topicItems={item} index={index} placement="adaptive" />
							)}
							keyExtractor={(item) => item.id}
							scrollEnabled={false}
						/>
					</View>
				</View>
				<View
					style={{
						height: 100,
						backgroundColor: "#ffffff",
						transform: [{ scale: 1.2 }],
					}}
				></View>
			</ScrollView>
		</>
	);
};

export default MyProfile;
