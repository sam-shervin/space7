import FontAwesomeFreeSolid from "@react-native-vector-icons/fontawesome-free-solid";
import { useRef, useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
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

	const otpInputRef = useRef<TextInput>(null);
	const [otpValue, setOtpValue] = useState("");
	const [otpSelection, setOtpSelection] = useState({ start: 0, end: 0 });
	const otpBoxIds = ["otp1", "otp2", "otp3", "otp4", "otp5", "otp6"];

	const focusOtpAt = (position: number) => {
		const bounded = Math.max(0, Math.min(position, otpValue.length));
		setOtpSelection({ start: bounded, end: bounded });
		setTimeout(() => {
			otpInputRef.current?.focus();
		}, 0);
	};

	const handleOtpChange = (text: string) => {
		const numberOnlyText = text.replace(/[^0-9]/g, "").slice(0, 6);
		setOtpValue(numberOnlyText);
	};
	const handleSignup = async () => {
		try {
			setSignupFailed(false);
			const response = await signup(username, email, password);
			if (response.status === 201) {
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
			const response = await verifyOTP(otpValue, email);
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
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
			style={{ flex: 1, width: "100%" }}
		>
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
					style={{
						marginLeft: 20,
						marginTop: 20,
						position: "absolute",
						left: 3,
					}}
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
					onChangeText={(text) => setEmail(text.toLowerCase())}
					autoCapitalize="none"
					autoCorrect={false}
					keyboardType="email-address"
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
					autoCapitalize="none"
					autoCorrect={false}
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
					autoCapitalize="none"
					autoCorrect={false}
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
						<TextInput
							ref={otpInputRef}
							value={otpValue}
							onChangeText={handleOtpChange}
							onSelectionChange={({ nativeEvent }) =>
								setOtpSelection(nativeEvent.selection)
							}
							selection={otpSelection}
							keyboardType="number-pad"
							autoCapitalize="none"
							autoCorrect={false}
							maxLength={6}
							style={{
								position: "absolute",
								opacity: 0,
								width: 1,
								height: 1,
							}}
						/>
						<View style={{ flexDirection: "row", gap: 10 }}>
							{otpBoxIds.map((id, index) => (
								<Pressable
									key={id}
									onPress={() => focusOtpAt(index + 1)}
									style={{
										width: 50,
										height: 50,
										borderWidth: 2,
										borderRadius: 8,
										alignItems: "center",
										justifyContent: "center",
										borderColor:
											otpSelection.start === index + 1 ? "#2E7D32" : "black",
									}}
								>
									<Text style={{ fontSize: 20, color: "black" }}>
										{otpValue[index] ?? ""}
									</Text>
								</Pressable>
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
							<Text
								style={{ fontFamily: "Montserrat-ExtraBold", fontSize: 17 }}
							>
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
		</KeyboardAvoidingView>
	);
};
