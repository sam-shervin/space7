import FontAwesomeFreeSolid from "@react-native-vector-icons/fontawesome-free-solid";
import { useCallback, useEffect, useState } from "react";
import {
	FlatList,
	Image,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { getMySpaces, type Space } from "../../api/Spaces";
import { useTopic } from "../../context/SpaceContext";

const SadRobotText = require("../../assets/images/sad_robot_text.png");

const styles = StyleSheet.create({
	headerBackground: {
		paddingTop: 30,
		backgroundColor: "#27A6FD",
		paddingBottom: 10,
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
		alignItems: "center",
	},
	filterButton: {
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderWidth: 2,
		borderColor: "black",
		borderRadius: 20,
		marginRight: 8,
		backgroundColor: "white",
	},
	activeFilterButton: {
		backgroundColor: "#FB3498",
	},
	spaceCard: {
		backgroundColor: "white",
		marginHorizontal: 12,
		marginBottom: 12,
		padding: 16,
		borderWidth: 2,
		borderColor: "black",
		borderRadius: 16,
		borderBottomWidth: 5,
		borderRightWidth: 5,
	},
});

const SpaceItem = ({ item, onPress }: { item: Space; onPress: () => void }) => {
	return (
		<View style={styles.spaceCard}>
			<TouchableOpacity activeOpacity={1} onPress={onPress}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginBottom: 8,
					}}
				>
					<Text
						style={{
							fontFamily: "Montserrat-ExtraBold",
							fontSize: 20,
							flex: 1,
							color: "black",
						}}
					>
						{item.title}
					</Text>
				</View>

				<Text
					style={{
						fontFamily: "Montserrat-Medium",
						fontSize: 15,
						color: "black",
						marginBottom: 10,
					}}
				>
					{item.description}
				</Text>

				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginBottom: 10,
					}}
				>
					<Text style={{ fontFamily: "Montserrat-Medium", color: "black" }}>
						By @{item.creator.username}
					</Text>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginLeft: "auto",
						}}
					>
						<FontAwesomeFreeSolid name="user" size={15} color="#000000" />
						<Text
							style={{
								marginLeft: 4,
								fontFamily: "Montserrat-Bold",
								color: "black",
							}}
						>
							{item.participant_count}
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
				{item.tags.map((tag) => (
					<View
						key={`${item.space_id}-${tag.tag_id}`}
						style={{
							backgroundColor: "#27A6FD",
							paddingHorizontal: 8,
							paddingVertical: 4,
							borderRadius: 12,
							marginRight: 6,
							borderWidth: 1,
							borderColor: "black",
						}}
					>
						<Text
							style={{
								fontFamily: "Montserrat-Bold",
								fontSize: 12,
								color: "black",
							}}
						>
							#{tag.tag_name}
						</Text>
					</View>
				))}
			</ScrollView>
		</View>
	);
};

const MyDiscussions = () => {
	const { setTopicId } = useTopic();
	const [spaces, setSpaces] = useState<Space[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [refreshing, setRefreshing] = useState(false);

	const loadMySpaces = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const data = await getMySpaces();

			setSpaces(data);
		} catch (loadError) {
			setError(
				loadError instanceof Error
					? loadError.message
					: "Failed to load my spaces",
			);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadMySpaces();
	}, [loadMySpaces]);

	const onRefresh = async () => {
		setRefreshing(true);
		await loadMySpaces();
		setRefreshing(false);
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={styles.headerBackground}>
				{/*Header*/}
				<View style={styles.header}>
					<Text style={styles.logoText}>
						space<Text style={{ color: "yellow" }}>7</Text>
					</Text>
				</View>
			</View>
			<View
				style={{
					backgroundColor: "#ffe149ff",
					padding: 10,
					borderTopWidth: 3,
					borderBottomWidth: 3,
				}}
			>
				<Text style={{ fontFamily: "Montserrat-ExtraBold", fontSize: 32 }}>
					My Discussions
				</Text>
			</View>
			<View
				style={{
					flex: 1,
					backgroundColor: "#FDFAF9",
				}}
			>
				{loading ? (
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Text style={{ fontFamily: "Montserrat-Bold", color: "black" }}>
							Loading your spaces...
						</Text>
					</View>
				) : error ? (
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							paddingHorizontal: 20,
						}}
					>
						<Text
							style={{
								fontFamily: "Montserrat-Bold",
								color: "#C2255C",
								textAlign: "center",
							}}
						>
							{error}
						</Text>
					</View>
				) : spaces.length === 0 ? (
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Image
							style={{
								resizeMode: "contain",
								width: "100%",
								height: 280,
							}}
							source={SadRobotText}
						/>
					</View>
				) : (
					<FlatList
						data={spaces}
						style={{ marginBottom: 80 }}
						refreshControl={
							<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
						}
						renderItem={({ item }) => (
							<SpaceItem
								item={item}
								onPress={() => setTopicId(item.space_id)}
							/>
						)}
						keyExtractor={(item) => item.space_id}
						contentContainerStyle={{ paddingVertical: 12 }}
					/>
				)}
			</View>
		</View>
	);
};

export default MyDiscussions;
