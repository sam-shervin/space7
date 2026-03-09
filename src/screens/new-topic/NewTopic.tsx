import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

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

const NewTopic = () => {
	return (
		<View style={{ flex: 1 }}>
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
						style={{
							fontFamily: "Montserrat-Medium",
							fontSize: 20,
							flex: 1,
							color: "black",
							marginHorizontal: 5,
						}}
						placeholder="# Add hashtags. . ."
						placeholderTextColor="#7f7d7dff"
					/>
				</View>
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
							backgroundColor: "#00e85dff",
							borderBottomWidth: 5,
							borderRightWidth: 5,
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
							backgroundColor: "#FF4FA3",
							borderBottomWidth: 5,
							borderRightWidth: 5,
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
							backgroundColor: "#FFD60A",
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
							Create
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default NewTopic;
