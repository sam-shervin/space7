import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import { useState } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

const Home = () => {
	const [focused, setFocused] = useState(false);
	const [pressed, setPressed] = useState(false);
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
	return (
		<View>
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
		</View>
	);
};

export default Home;
