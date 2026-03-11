import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { login } from "../../api/Auth";
import { useAuth } from "../../context/AuthContext";

export const LoginScreen = ({
	setScreen,
}: {
	setScreen: React.Dispatch<
		React.SetStateAction<"login" | "signup" | "forgot" | "reset">
	>;
}) => {
	const { login: signIn } = useAuth();
	const [underlineForgot, setUnderlineForgot] = useState(false);
	const [underlineSignUp, setUnderlineSignUp] = useState(false);

	const [loginFailed, setLoginFailed] = useState(false);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async () => {
		try {
			setLoginFailed(false);
			const response = await login(email, password);
			await signIn(response.token);
		} catch (error) {
			setLoginFailed(true);
			console.error("Login failed:", error);
		}
	};

	const handlePressForgot = () => {
		setUnderlineForgot(true);
		setTimeout(() => {
			setUnderlineForgot(false);
		}, 1000);
	};

	const handlePressSignUp = () => {
		setUnderlineSignUp(true);
		setTimeout(() => {
			setUnderlineSignUp(false);
		}, 1000);
	};
	return (
		<View
			style={{
				paddingVertical: 50,
				paddingBottom: 50,
				backgroundColor: "white",
				padding: 20,
				borderTopEndRadius: 30,
				borderTopStartRadius: 30,
				flex: 1,
				width: "100%",
				flexDirection: "column",
				alignItems: "center",
				borderColor: "black",
				borderWidth: 2,
			}}
		>
			<Text
				style={{
					fontSize: 32,
					marginTop: 20,
					color: "#000000ff",
					fontFamily: "Montserrat-Bold",
				}}
			>
				Login
			</Text>
			<TextInput
				cursorColor={"black"}
				value={email}
				onChangeText={setEmail}
				style={{
					borderColor: "black",
					borderWidth: 2,
					borderRadius: 10,
					fontSize: 16,
					marginTop: 20,
					width: "80%",
					color: "black",
					fontFamily: "Montserrat-Regular",
					backgroundColor: "#CAE990",
					textAlign: "center",
				}}
				placeholderTextColor={"black"}
				placeholder="Email"
			/>
			<TextInput
				cursorColor={"black"}
				value={password}
				onChangeText={setPassword}
				style={{
					borderColor: "black",
					borderWidth: 2,
					borderRadius: 10,
					marginTop: 20,
					width: "80%",
					paddingHorizontal: 1,
					fontSize: 16,
					color: "black",
					fontFamily: "Montserrat-Regular",
					backgroundColor: "#FC79B3",
					textAlign: "center",
				}}
				placeholderTextColor={"black"}
				placeholder="Password"
				secureTextEntry
			/>
			<View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
				<View style={{ flex: 1 }}></View>
				<TouchableOpacity
					activeOpacity={1}
					style={{ marginTop: 20 }}
					onPress={() => {
						handlePressForgot();
						setScreen("forgot");
					}}
				>
					<Text
						style={{
							color: "black",
							fontFamily: "Montserrat-Regular",
							textDecorationLine: underlineForgot ? "underline" : "none",
						}}
					>
						Forgot Password?
					</Text>
				</TouchableOpacity>
			</View>
			<TouchableOpacity
				style={{
					width: 100,
					backgroundColor: "#FFD60A",
					alignItems: "center",
					padding: 5,
					borderRadius: 10,
					marginTop: 20,
					borderColor: "black",
					borderWidth: 2,
				}}
				onPress={handleLogin}
			>
				<Text style={{ fontFamily: "Montserrat-ExtraBold", fontSize: 25 }}>
					Login
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				activeOpacity={1}
				style={{ marginTop: 20 }}
				onPress={() => {
					handlePressSignUp();
					setScreen("signup");
				}}
			>
				<Text
					style={{
						fontFamily: "Montserrat-Regular",
						fontSize: 16,
						textDecorationLine: underlineSignUp ? "underline" : "none",
					}}
				>
					Don't have an account? Sign Up
				</Text>
			</TouchableOpacity>
			{loginFailed && (
				<Text style={{ color: "red", marginTop: 10 }}>
					Login failed. Please check your email and password.
				</Text>
			)}
		</View>
	);
};
