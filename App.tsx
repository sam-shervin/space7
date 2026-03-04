import { StyleSheet, Text, View } from "react-native";

const HelloWorldApp = () => {
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
		},
	});
	return (
		<View style={styles.container}>
			<Text>Hello, world!</Text>
		</View>
	);
};
export default HelloWorldApp;
