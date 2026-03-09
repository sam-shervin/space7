import FontAwesomeFreeSolid from "@react-native-vector-icons/fontawesome-free-solid";
import { Image, StyleSheet, Text, View } from "react-native";

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
});

const MyDiscussions = () => {
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
					My Discussions
				</Text>
			</View>
			<View
				style={{
					flex: 1,
					flexDirection: "column",
					alignContent: "center",
					backgroundColor: "#FDFAF9",
				}}
			>
				<Image
					style={{ resizeMode: "contain", flex: 1, width: "100%", bottom: 50 }}
					source={SadRobotText}
				/>
			</View>
		</View>
	);
};

export default MyDiscussions;
