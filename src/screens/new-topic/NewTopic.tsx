import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import { useNavigation } from "@react-navigation/native";
import { useMemo, useState } from "react";
import {
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { createSpace, type Space } from "../../api/Spaces";

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
});

type AppNavigation = {
	navigate: (screen: "MyDiscussions") => void;
};

const NewTopic = () => {
	const navigation = useNavigation<AppNavigation>();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [hashtagsInput, setHashtagsInput] = useState("");
	const [visibility, setVisibility] = useState<Space["visibility"]>("public");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const hashtags = useMemo(() => {
		return hashtagsInput
			.split(",")
			.map((tag) => tag.replace(/#/g, "").trim())
			.filter(Boolean);
	}, [hashtagsInput]);

	const handleCreate = async () => {
		if (!title.trim() || !description.trim()) {
			setError("Title and description are required");
			return;
		}

		try {
			setLoading(true);
			setError("");

			await createSpace({
				title: title.trim(),
				description: description.trim(),
				visibility,
				hashtags,
			});

			setTitle("");
			setDescription("");
			setHashtagsInput("");
			navigation.navigate("MyDiscussions");
		} catch (createError) {
			setError(
				createError instanceof Error
					? createError.message
					: "Failed to create space",
			);
		} finally {
			setLoading(false);
		}
	};

		return (
	<KeyboardAvoidingView
		style={{ flex: 1 }}
		behavior={Platform.OS === "ios" ? "padding" : "height"}
	>
		<ScrollView
			style={{ flex: 1}}
			contentContainerStyle={{ paddingBottom: 150 }}
			keyboardShouldPersistTaps="handled"
		>
			<View style={styles.headerBackground}>
				{/*Header*/}
				<View style={styles.header}>
					<Text style={styles.logoText}>
						space<Text style={{ color: "yellow" }}>7</Text>
					</Text>

					<FontAwesomeFreeSolid
						style={{
							padding: 3,
							backgroundColor: "#FB3498",
							borderRadius: 8,
							borderWidth: 3,
							borderColor: "black",
							marginLeft: 5,
							paddingHorizontal: 10,
						}}
						name="x"
						size={23}
						color="#000000"
					/>
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
					New Topic
				</Text>
			</View>
			<View style={{ padding: 10, flexDirection: "row" }}>
				<View
					style={{
						backgroundColor: "#00CFE8",
						paddingHorizontal: 8,
						borderRadius: 8,
						borderWidth: 3,
					}}
				>
					<Text style={{ fontFamily: "Montserrat-ExtraBold", fontSize: 20 }}>
						Title
					</Text>
				</View>
			</View>
			<View
				style={{
					marginTop: 5,
					marginBottom: 12,
					marginHorizontal: 10,
					padding: 1.7,
					paddingVertical: 2,

					backgroundColor: "#d0f7fcff",
					flexDirection: "row",
					alignItems: "center",
					borderRadius: 12,
					borderWidth: 3,
					borderColor: "black",
					borderBottomWidth: 5,
				}}
			>
				<TextInput
					value={title}
					onChangeText={setTitle}
					style={{
						fontFamily: "Montserrat-Medium",
						fontSize: 15,
						flex: 1,
						color: "black",

						marginHorizontal: 5,
					}}
					placeholder="Enter topic title. . ."
					placeholderTextColor="#7f7d7dff"
				/>
			</View>

			<View style={{ padding: 10, flexDirection: "row" }}>
				<View
					style={{
						backgroundColor: "#FF4FA3",
						paddingHorizontal: 8,
						borderRadius: 8,
						borderWidth: 3,
					}}
				>
					<Text style={{ fontFamily: "Montserrat-ExtraBold", fontSize: 20 }}>
						Description
					</Text>
				</View>
			</View>
			<View
				style={{
					marginTop: 5,
					marginBottom: 12,
					marginHorizontal: 10,
					padding: 1.7,
					paddingVertical: 2,
					height: 100,
					backgroundColor: "#ffffff",
					flexDirection: "row",
					alignItems: "center",
					borderRadius: 12,
					borderWidth: 3,
					borderColor: "black",
					borderBottomWidth: 5,
				}}
			>
				<TextInput
					multiline
					editable
					numberOfLines={4}
					value={description}
					onChangeText={setDescription}
					style={{
						fontFamily: "Montserrat-Medium",
						fontSize: 15,
						flex: 1,
						color: "black",
						marginHorizontal: 5,
					}}
					placeholder="Enter topic description. . ."
					placeholderTextColor="#7f7d7dff"
				/>
			</View>
			<View style={{ paddingHorizontal: 10, flexDirection: "row" }}>
				<View
					style={{
						backgroundColor: "#FFD60A",
						paddingHorizontal: 8,
						borderTopStartRadius: 8,
						borderTopEndRadius: 8,
						borderBottomWidth: 0,
						borderLeftWidth: 3,
						borderRightWidth: 5,
						borderTopWidth: 3,
						position: "relative",
						top: 3.37,
						zIndex: 1,
					}}
				>
					<Text style={{ fontFamily: "Montserrat-ExtraBold", fontSize: 20 }}>
						# Hashtags
					</Text>
				</View>
			</View>
			<View
				style={{
					paddingHorizontal: 10,
					backgroundColor: "#FFD60A",
					borderLeftWidth: 3,
					borderRightWidth: 5,
					borderColor: "black",
					borderBottomWidth: 5,
					marginHorizontal: 10,
					borderTopWidth: 3,
					marginBottom: 20,
					borderBottomEndRadius: 20,
					borderBottomStartRadius: 20,
				}}
			>
				<View
					style={{
						marginTop: 5,
						marginBottom: 12,
						marginHorizontal: 10,
						padding: 1.7,
						paddingVertical: 2,

						backgroundColor: "#d0f7fcff",
						flexDirection: "row",
						alignItems: "center",
						borderRadius: 12,
						borderWidth: 3,
						borderColor: "black",
						borderBottomWidth: 5,
					}}
				>
					<TextInput
						value={hashtagsInput}
						onChangeText={setHashtagsInput}
						style={{
							fontFamily: "Montserrat-Medium",
							fontSize: 14,
							flex: 1,
							color: "black",
							marginHorizontal: 5,
						}}
						placeholder="# Add hashtags separated by commas"
						placeholderTextColor="#7f7d7dff"
						multiline
						textAlignVertical="top"
					/>
				</View>
				{hashtags.length > 0 && (
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 12 }}
					>
						{hashtags.map((tag) => (
							<View
								key={tag}
								style={{
									backgroundColor: "#00CFE8",
									paddingHorizontal: 8,
									paddingVertical: 4,
									borderRadius: 12,
									borderWidth: 2,
									borderColor: "black",
									marginRight: 8,
								}}
							>
								<Text style={{ fontFamily: "Montserrat-Bold", color: "black" }}>
									#{tag}
								</Text>
							</View>
						))}
					</ScrollView>
				)}
			</View>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					marginHorizontal: 20,
				}}
			>
				<TouchableOpacity
					style={{ flex: 1, alignItems: "center" }}
					activeOpacity={1}
					onPress={() => setVisibility("public")}
				>
					<View
						style={{
							padding: 10,
							borderWidth: 3,
							borderColor: "black",
							borderRadius: 16,
							flexDirection: "row",
							alignItems: "center",
							width: "90%",
							justifyContent: "center",
							backgroundColor:
								visibility === "public" ? "#00e85dff" : "#e0f9e8ff",
							borderBottomWidth: visibility === "public" ? 5 : 3,
							borderRightWidth: visibility === "public" ? 5 : 3,
						}}
					>
						<FontAwesomeFreeSolid name={"globe"} size={23} color="#000000" />
						<Text
							style={{
								fontFamily: "Montserrat-ExtraBold",
								fontSize: 20,
								marginLeft: 5,
							}}
						>
							Public
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={{ flex: 1, alignItems: "center" }}
					activeOpacity={1}
					onPress={() => setVisibility("private")}
				>
					<View
						style={{
							padding: 10,
							borderWidth: 3,
							borderColor: "black",
							borderRadius: 16,
							flexDirection: "row",
							alignItems: "center",
							width: "90%",
							justifyContent: "center",
							backgroundColor:
								visibility === "private" ? "#FF4FA3" : "#fcf3f7ff",
							borderBottomWidth: visibility === "private" ? 5 : 3,
							borderRightWidth: visibility === "private" ? 5 : 3,
						}}
					>
						<FontAwesomeFreeSolid name={"lock"} size={23} color="#000000" />
						<Text
							style={{
								fontFamily: "Montserrat-ExtraBold",
								fontSize: 20,
								marginLeft: 5,
							}}
						>
							Private
						</Text>
					</View>
				</TouchableOpacity>
			</View>
			{error ? (
				<Text
					style={{
						color: "#C2255C",
						fontFamily: "Montserrat-Bold",
						textAlign: "center",
						marginTop: 12,
						marginHorizontal: 20,
					}}
				>
					{error}
				</Text>
			) : null}
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					marginHorizontal: 90,
					marginVertical: 20,
				}}
			>
				<TouchableOpacity
					style={{ flex: 1, alignItems: "center" }}
					activeOpacity={1}
					onPress={handleCreate}
					disabled={loading}
				>
					<View
						style={{
							padding: 10,
							borderWidth: 3,
							borderColor: "black",
							borderRadius: 49,
							flexDirection: "row",
							alignItems: "center",
							width: "90%",
							justifyContent: "center",
							backgroundColor: loading ? "#F5E7A1" : "#FFD60A",
							borderBottomWidth: 5,
							borderRightWidth: 5,
						}}
					>
						<Text
							style={{
								fontFamily: "Montserrat-ExtraBold",
								fontSize: 32,
								marginLeft: 5,
							}}
						>
							{loading ? "Creating..." : "Create"}
						</Text>
					</View>
				</TouchableOpacity>
				
			</View>
			
			</ScrollView>
	</KeyboardAvoidingView>
);
};

export default NewTopic;
