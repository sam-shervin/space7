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
import { forgotPassword, resetPassword } from "../../api/Auth";

export const ForgotScreen = ({
	setScreen,
}: {
	setScreen: React.Dispatch<
		React.SetStateAction<"login" | "signup" | "forgot" | "reset">
	>;
}) => {
	const [email, setEmail] = useState("");
	const [otpValue, setOtpValue] = useState("");
	const [otpSelection, setOtpSelection] = useState({ start: 0, end: 0 });
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [otpSent, setOtpSent] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const otpBoxIds = ["otp1", "otp2", "otp3", "otp4", "otp5", "otp6"];

	const otpInputRef = useRef<TextInput>(null);

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

	const handleSendOTP = async () => {
		try {
			setErrorMessage("");
			setSuccessMessage("");
			await forgotPassword(email);
			setOtpSent(true);
			setSuccessMessage("OTP sent to your email");
		} catch (error) {
			setOtpSent(false);
			setErrorMessage(
				error instanceof Error
					? error.message
					: "Failed to send forgot password OTP",
			);
		}
	};

	const handleResetPassword = async () => {
		if (newPassword !== confirmPassword) {
			setErrorMessage("Passwords do not match");
			return;
		}

		try {
			setErrorMessage("");
			setSuccessMessage("");
			await resetPassword(email, otpValue, newPassword);
			setSuccessMessage("Password reset successful. Please login.");
			setTimeout(() => {
				setScreen("login");
			}, 800);
		} catch (error) {
			setErrorMessage(
				error instanceof Error ? error.message : "Failed to reset password",
			);
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
					paddingVertical: 30,
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
					Forgot Password
				</Text>

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

				{!otpSent ? (
					<TouchableOpacity
						style={{
							width: 220,
							backgroundColor: "#FFD60A",
							alignItems: "center",
							padding: 8,
							borderRadius: 10,
							marginTop: 20,
							borderColor: "black",
							borderWidth: 2,
						}}
						onPress={handleSendOTP}
					>
						<Text style={{ fontFamily: "Montserrat-ExtraBold", fontSize: 20 }}>
							Send OTP
						</Text>
					</TouchableOpacity>
				) : (
					<>
						<View style={{ alignItems: "center", marginTop: 14 }}>
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
						</View>

						<TextInput
							cursorColor={"black"}
							value={newPassword}
							onChangeText={setNewPassword}
							autoCapitalize="none"
							autoCorrect={false}
							style={{
								borderColor: "black",
								borderWidth: 2,
								borderRadius: 10,
								fontSize: 16,
								marginTop: 14,
								width: "80%",
								color: "black",
								fontFamily: "Montserrat-Regular",
								backgroundColor: "#FC79B3",
								textAlign: "center",
							}}
							placeholderTextColor={"black"}
							placeholder="New Password"
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
								fontSize: 16,
								marginTop: 14,
								width: "80%",
								color: "black",
								fontFamily: "Montserrat-Regular",
								backgroundColor: "#e5b9f8ff",
								textAlign: "center",
							}}
							placeholderTextColor={"black"}
							placeholder="Confirm Password"
							secureTextEntry
						/>

						<TouchableOpacity
							style={{
								width: 250,
								backgroundColor: "#FFD60A",
								alignItems: "center",
								padding: 8,
								borderRadius: 10,
								marginTop: 20,
								borderColor: "black",
								borderWidth: 2,
							}}
							onPress={handleResetPassword}
						>
							<Text
								style={{ fontFamily: "Montserrat-ExtraBold", fontSize: 19 }}
							>
								Reset Password
							</Text>
						</TouchableOpacity>
					</>
				)}

				{errorMessage ? (
					<Text style={{ color: "red", marginTop: 12 }}>{errorMessage}</Text>
				) : null}

				{successMessage ? (
					<Text style={{ color: "green", marginTop: 12 }}>
						{successMessage}
					</Text>
				) : null}
			</View>
		</KeyboardAvoidingView>
	);
};
