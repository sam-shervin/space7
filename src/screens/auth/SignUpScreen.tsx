import FontAwesomeFreeSolid from "@react-native-vector-icons/fontawesome-free-solid";
import { useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { signup, verifyOTP } from "../../api/Auth";
import { useAuth } from "../../context/AuthContext";

export const SignUpScreen = ({
	setScreen,
}: {
	setScreen: React.Dispatch<
		React.SetStateAction<"login" | "signup" | "forgot" | "reset">
	>;
}) => {
	const { login: signIn } = useAuth();

	const [loginFailed, setLoginFailed] = useState(false);
	const [signupFailed, setSignupFailed] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [sentOTP, setSentOTP] = useState(false);

	const [otp, setOtp] = useState([
		{ id: "otp1", value: "" },
		{ id: "otp2", value: "" },
		{ id: "otp3", value: "" },
		{ id: "otp4", value: "" },
		{ id: "otp5", value: "" },
		{ id: "otp6", value: "" },
	]);

	const inputs = [
		useRef<TextInput>(null),
		useRef<TextInput>(null),
		useRef<TextInput>(null),
		useRef<TextInput>(null),
		useRef<TextInput>(null),
		useRef<TextInput>(null),
	];

	const handleChange = (text: string, index: number) => {
		const newOtp = [...otp];
		newOtp[index].value = text;
		setOtp(newOtp);

		if (text && index < 5) {
			inputs[index + 1].current?.focus();
		}
	};

	const handleBackspace = (key: string, index: number) => {
		if (key === "Backspace" && !otp[index].value && index > 0) {
			inputs[index - 1].current?.focus();
		}
	};
	const handleSignup = async () => {
		try {
			setSignupFailed(false);
			const response = await signup(username, email, password);
			console.log(response.status);
			if (response.status === 201) {
				console.log("received 201");
				setSentOTP(true);
			}
		} catch (error) {
			setSentOTP(false);
			setSignupFailed(true);
			console.error("Signup failed:", error);
		}
	};

	const handleOTP = async () => {
		try {
			const response = await verifyOTP(otp.map((o) => o.value).join(""), email);
			if (response.status === 200) {
				signIn(response.token);
				setLoginFailed(false);
			}
		} catch (error) {
			setLoginFailed(true);
			console.error("OTP verification failed:", error);
		}
	};

	return (
		<View
			style={{
				paddingVertical: 20,
				paddingBottom: 30,
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
			{/* Back arrow on the top left */}

			<FontAwesomeFreeSolid
				onPress={() => setScreen("login")}
				style={{ marginLeft: 20, marginTop: 20, position: "absolute", left: 3 }}
				name="arrow-left"
				size={25}
				color="black"
			/>
			<Text
				style={{
					fontSize: 32,
					marginTop: 20,
					color: "#000000ff",
					fontFamily: "Montserrat-Bold",
				}}
			>
				Sign Up
			</Text>
			<TextInput
				cursorColor={"black"}
				value={username}
				onChangeText={setUsername}
				style={{
					borderColor: "black",
					borderWidth: 2,
					borderRadius: 10,
					fontSize: 16,
					marginTop: 10,
					width: "80%",
					color: "black",
					fontFamily: "Montserrat-Regular",
					backgroundColor: "#a3edf5ff",
					textAlign: "center",
				}}
				placeholderTextColor={"black"}
				placeholder="Username"
			/>
			<TextInput
				cursorColor={"black"}
				value={email}
				onChangeText={setEmail}
				style={{
					borderColor: "black",
					borderWidth: 2,
					borderRadius: 10,
					fontSize: 16,
					marginTop: 10,
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
					marginTop: 10,
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
			<TextInput
				cursorColor={"black"}
				value={confirmPassword}
				onChangeText={setConfirmPassword}
				style={{
					borderColor: "black",
					borderWidth: 2,
					borderRadius: 10,
					marginTop: 10,
					width: "80%",
					paddingHorizontal: 1,
					fontSize: 16,
					color: "black",
					fontFamily: "Montserrat-Regular",
					backgroundColor: "#e5b9f8ff",
					textAlign: "center",
				}}
				placeholderTextColor={"black"}
				placeholder="Confirm Password"
				secureTextEntry
			/>
			<View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
				<View style={{ flex: 1 }}></View>
			</View>
			<TouchableOpacity
				style={{
					width: 200,
					backgroundColor: "#FFD60A",
					alignItems: "center",
					padding: 5,
					borderRadius: 10,
					marginTop: 20,
					borderColor: "black",
					borderWidth: 2,
				}}
				onPress={handleSignup}
			>
				<Text style={{ fontFamily: "Montserrat-ExtraBold", fontSize: 25 }}>
					Sign Up
				</Text>
			</TouchableOpacity>

			{signupFailed && (
				<Text style={{ color: "red", marginTop: 10 }}>
					Signup failed. Please check your details and try again.
				</Text>
			)}

			{sentOTP && (
				<View style={{ alignItems: "center", marginTop: 30 }}>
					<View style={{ flexDirection: "row", gap: 10 }}>
						{otp.map((digit, index) => (
							<TextInput
								key={digit.id}
								ref={inputs[index]}
								value={digit.value}
								keyboardType="number-pad"
								maxLength={1}
								onChangeText={(text) => handleChange(text, index)}
								onKeyPress={({ nativeEvent }) =>
									handleBackspace(nativeEvent.key, index)
								}
								style={{
									width: 50,
									height: 50,
									borderWidth: 2,
									borderRadius: 8,
									textAlign: "center",
									fontSize: 20,
								}}
							/>
						))}
					</View>

					<TouchableOpacity
						style={{
							width: 250,
							backgroundColor: "#FFD60A",
							alignItems: "center",
							padding: 8,
							borderRadius: 10,
							marginTop: 30,
							borderColor: "black",
							borderWidth: 2,
						}}
						onPress={handleOTP}
					>
						<Text style={{ fontFamily: "Montserrat-ExtraBold", fontSize: 17 }}>
							Verify OTP and Login
						</Text>
					</TouchableOpacity>
				</View>
			)}
			{loginFailed && (
				<Text style={{ color: "red", marginTop: 10 }}>
					Login failed. Please check your OTP and try again.
				</Text>
			)}
		</View>
	);
};
