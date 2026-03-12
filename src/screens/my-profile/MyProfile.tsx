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
import { useUser } from "../../context/UserContext";
import type { TopicItem } from "../../types/types";
import { getMySpaces } from "../../api/Spaces";
import type { Space } from "../../api/Spaces";
import { useEffect, useState } from "react";
import { useTopic } from "../../context/SpaceContext";


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
			<TouchableOpacity activeOpacity={1} onPress={onPress}>
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
			</TouchableOpacity>

			<ScrollView
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


const MyProfile = () => {
	const { user: profile } = useUser();
	const [myTopics, setMyTopics] = useState<TopicItem[]>([]);
	const [selectedVisibility, setSelectedVisibility] = useState<"public" | "private">("public");

	useEffect(() => {
		const loadMySpaces = async () => {
			if (!profile) {
				setMyTopics([]);
				return;
			}

			try {
				const spaces = await getMySpaces();
				const createdSpaces = spaces.filter(
					(space) => space.creator.user_id === profile.user_id,
				);
				setMyTopics(createdSpaces.map(mapSpaceToTopicItem));
			} catch {
				setMyTopics([]);
			}
		};

		loadMySpaces();
	}, [profile]);

	const { setTopicId } = useTopic();

	const { logout } = useAuth();

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
					<Lucide
						style={{
							position: "absolute",
							top: 70,
							left: 380,
							transform: [{ scale: 0.7 }],
						}}
						name="sparkle"
						size={35}
						color="#000000"
					/>
				</View>
				<Image
					source={{ uri: profile?.profile_picture }}
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
						{profile?.username}
					</Text>
					{profile?.bio ? (
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
							{profile?.bio.replace(/\\n/g, "\n")}
						</Text>
					</View>) : <Text style={{ fontFamily: "Montserrat-Regular", fontSize: 16, paddingHorizontal: 30, paddingVertical: 10 }}>Share a little about yourself, your interests, or what you like to talk about.</Text>}
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
									fontSize: 35,
									marginVertical: -10,
								}}
							>
								{profile?.stats.spaces_created}
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
									fontSize: 35,
									marginVertical: -10,
								}}
							>
								{profile?.stats.spaces_participated}
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
			backgroundColor: selectedVisibility === "public" ? "#2DD36F" : "#ffffff",
			alignItems: "center",
			padding: 5,
			borderRadius: 10,
			paddingHorizontal: 30,
			borderWidth: 2,
			borderRightWidth: 5,
			borderBottomWidth: 5,
		}}
	>
		<Text
			style={{ fontFamily: "Montserrat-Bold", fontSize: 22 }}
			onPress={() => setSelectedVisibility("public")}
		>
			Public
		</Text>
	</View>

	<View
		style={{
			backgroundColor: selectedVisibility === "private" ? "#f76db0" : "#ffffff",
			alignItems: "center",
			padding: 5,
			borderRadius: 10,
			paddingHorizontal: 30,
			borderWidth: 2,
			borderRightWidth: 5,
			borderBottomWidth: 5,
		}}
	>
		<Text
			style={{ fontFamily: "Montserrat-Bold", fontSize: 22 }}
			onPress={() => setSelectedVisibility("private")}
		>
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
							style={{ marginBottom: 80 }}
							showsHorizontalScrollIndicator={false}
							showsVerticalScrollIndicator={false}
							data={myTopics}
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
									No spaces created yet.
								</Text>
							}
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
