import { pick, types as pickerTypes } from "@react-native-documents/picker";
import FontAwesomeFreeSolid from "@react-native-vector-icons/fontawesome-free-solid";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	BackHandler,
	KeyboardAvoidingView,
	Modal,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import {
	deleteAccount,
	updateBio,
	updatePassword,
	updateProfilePicture,
	updateUsername,
} from "../../api/Profile";

type ProfileMenuProps = {
	visible: boolean;
	onClose: () => void;
	onProfileUpdated: () => Promise<void>;
	onLogout: () => Promise<void>;
};

const MAX_PROFILE_PICTURE_SIZE = 5 * 1024 * 1024;

const getErrorMessage = (error: unknown) => {
	const message = (error as { message?: string } | null)?.message;
	if (message) {
		return message;
	}

	return "Something went wrong";
};

const styles = StyleSheet.create({
	text: {
		fontFamily: "Montserrat-Bold",
		fontSize: 16,
		marginLeft: 12,
	},
});

const Profile = ({
	visible,
	onClose,
	onProfileUpdated,
	onLogout,
}: ProfileMenuProps) => {
	const [showUsernameInput, setShowUsernameInput] = useState(false);
	const [showBioInput, setShowBioInput] = useState(false);
	const [showPasswordInput, setShowPasswordInput] = useState(false);
	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [errorText, setErrorText] = useState("");
	const [successText, setSuccessText] = useState("");

	const handleClose = useCallback(() => {
		onClose();
	}, [onClose]);

	useEffect(() => {
		if (!visible) {
			return;
		}

		const subscription = BackHandler.addEventListener(
			"hardwareBackPress",
			() => {
				handleClose();
				return true;
			},
		);

		return () => subscription.remove();
	}, [visible, handleClose]);

	const clearMessages = () => {
		setErrorText("");
		setSuccessText("");
	};

	const closeInputs = () => {
		setShowUsernameInput(false);
		setShowBioInput(false);
		setShowPasswordInput(false);
	};

	const openUsername = () => {
		clearMessages();
		setShowUsernameInput(!showUsernameInput);
		setShowBioInput(false);
		setShowPasswordInput(false);
	};

	const openBio = () => {
		clearMessages();
		setShowBioInput(!showBioInput);
		setShowUsernameInput(false);
		setShowPasswordInput(false);
	};

	const openPassword = () => {
		clearMessages();
		setShowPasswordInput(!showPasswordInput);
		setShowUsernameInput(false);
		setShowBioInput(false);
	};

	const handleUpdateUsername = async () => {
		const trimmedUsername = username.trim();

		if (!trimmedUsername) {
			setErrorText("Username cannot be empty");
			return;
		}

		clearMessages();
		try {
			setLoading(true);
			const response = await updateUsername({ username: trimmedUsername });
			setSuccessText(response.message || "Username updated");
			setUsername("");
			closeInputs();
			setTimeout(() => {
				onProfileUpdated();
			}, 500);
		} catch (error) {
			setErrorText(getErrorMessage(error));
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateBio = async () => {
		clearMessages();
		try {
			setLoading(true);
			const response = await updateBio({ bio });
			setSuccessText(response.message || "Bio updated");
			closeInputs();
			setTimeout(() => {
				onProfileUpdated();
			}, 500);
		} catch (error) {
			setErrorText(getErrorMessage(error));
		} finally {
			setLoading(false);
		}
	};

	const handleUpdatePassword = async () => {
		if (!currentPassword || !newPassword) {
			setErrorText("Please fill both password fields");
			return;
		}

		clearMessages();
		try {
			setLoading(true);
			const response = await updatePassword({
				currentPassword,
				newPassword,
			});
			setSuccessText(response.message || "Password changed");
			setCurrentPassword("");
			setNewPassword("");
			closeInputs();
		} catch (error) {
			setErrorText(getErrorMessage(error));
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateProfilePicture = async () => {
		clearMessages();
		try {
			setLoading(true);
			const [file] = await pick({
				type: [pickerTypes.images],
				allowMultiSelection: false,
			});

			if (!file?.uri) {
				setErrorText("Couldn't get selected image");
				return;
			}

			if (
				typeof file.size === "number" &&
				file.size > MAX_PROFILE_PICTURE_SIZE
			) {
				setErrorText("Profile picture must be 5 MB or less");
				return;
			}

			await updateProfilePicture({
				uri: file.uri,
				name: file.name || `avatar-${Date.now()}.jpg`,
				type: file.type || "image/jpeg",
			});

			setSuccessText("Profile picture updated");
			setTimeout(() => {
				onProfileUpdated();
			}, 500);
		} catch (error) {
			const message = getErrorMessage(error);

			if (message.toLowerCase().includes("cancel")) {
				return;
			}

			setErrorText(message);
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteAccount = async () => {
		Alert.alert(
			"Delete Account",
			"This permanently deletes your account and all associated data.",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					style: "destructive",
					onPress: () => {
						void (async () => {
							clearMessages();
							try {
								setLoading(true);
								const response = await deleteAccount();
								setSuccessText(response.message || "Account deleted");
								onClose();
								await onLogout();
							} catch (error) {
								setErrorText(getErrorMessage(error));
							} finally {
								setLoading(false);
							}
						})();
					},
				},
			],
		);
	};

	const handleLogout = async () => {
		clearMessages();
		try {
			setLoading(true);
			onClose();
			await onLogout();
		} catch (error) {
			setErrorText(getErrorMessage(error));
		} finally {
			setLoading(false);
		}
	};

	const isLoading = loading;

	return (
		<Modal
			transparent
			visible={visible}
			animationType="fade"
			onRequestClose={handleClose}
		>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<View
					style={{
						flex: 1,
						backgroundColor: "rgba(0,0,0,0.4)",
						justifyContent: "center",
						paddingHorizontal: 18,
					}}
				>
					<TouchableOpacity
						activeOpacity={1}
						onPress={handleClose}
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
						}}
					/>

					<View
						style={{
							backgroundColor: "#ffffff",
							borderRadius: 24,
							borderWidth: 3,
							borderColor: "black",
							padding: 16,
						}}
					>
						<Text style={[styles.text, { marginBottom: 12 }]}>
							Profile Actions
						</Text>

						{errorText ? (
							<Text
								style={{
									fontFamily: "Montserrat-SemiBold",
									color: "#D62828",
									marginBottom: 12,
								}}
							>
								{errorText}
							</Text>
						) : null}

						{successText ? (
							<Text
								style={{
									fontFamily: "Montserrat-SemiBold",
									color: "#1F7A1F",
									marginBottom: 12,
								}}
							>
								{successText}
							</Text>
						) : null}

						<TouchableOpacity
							onPress={openUsername}
							disabled={isLoading}
							style={{
								backgroundColor: "#FFD60A",
								borderWidth: 2,
								borderBottomWidth: 5,
								borderRightWidth: 5,
								borderColor: "black",
								borderRadius: 16,
								paddingVertical: 14,
								paddingHorizontal: 16,
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 12,
							}}
						>
							<FontAwesomeFreeSolid name="pen" size={18} color="#000" />
							<Text style={styles.text}>Change Username</Text>
						</TouchableOpacity>

						{showUsernameInput ? (
							<View>
								<TextInput
									value={username}
									onChangeText={setUsername}
									placeholder="New username"
									style={{
										borderWidth: 2,
										borderColor: "black",
										borderRadius: 12,
										paddingHorizontal: 12,
										paddingVertical: 10,
										fontFamily: "Montserrat-Medium",
										color: "black",
										marginBottom: 8,
									}}
								/>
								<TouchableOpacity
									onPress={() => void handleUpdateUsername()}
									disabled={isLoading}
									style={{
										backgroundColor: "#B8E3FF",
										borderWidth: 2,
										borderColor: "black",
										borderBottomWidth: 4,
										borderRightWidth: 4,
										paddingVertical: 10,
										borderRadius: 12,
										alignItems: "center",
										marginBottom: 12,
									}}
								>
									<Text style={{ fontFamily: "Montserrat-Bold" }}>
										Save Username
									</Text>
								</TouchableOpacity>
							</View>
						) : null}

						<TouchableOpacity
							onPress={openBio}
							disabled={isLoading}
							style={{
								backgroundColor: "#72E97A",
								borderWidth: 2,
								borderBottomWidth: 5,
								borderRightWidth: 5,
								borderColor: "black",
								borderRadius: 16,
								paddingVertical: 14,
								paddingHorizontal: 16,
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 12,
							}}
						>
							<FontAwesomeFreeSolid name="pen" size={18} color="#000" />
							<Text style={styles.text}>Change Bio</Text>
						</TouchableOpacity>

						{showBioInput ? (
							<View>
								<TextInput
									value={bio}
									onChangeText={setBio}
									placeholder="New bio"
									multiline
									style={{
										borderWidth: 2,
										borderColor: "black",
										borderRadius: 12,
										paddingHorizontal: 12,
										paddingVertical: 10,
										fontFamily: "Montserrat-Medium",
										minHeight: 80,
										textAlignVertical: "top",
										color: "black",
										marginBottom: 8,
									}}
								/>
								<TouchableOpacity
									onPress={() => void handleUpdateBio()}
									disabled={isLoading}
									style={{
										backgroundColor: "#B8E3FF",
										borderWidth: 2,
										borderColor: "black",
										borderBottomWidth: 4,
										borderRightWidth: 4,
										paddingVertical: 10,
										borderRadius: 12,
										alignItems: "center",
										marginBottom: 12,
									}}
								>
									<Text style={{ fontFamily: "Montserrat-Bold" }}>
										Save Bio
									</Text>
								</TouchableOpacity>
							</View>
						) : null}

						<TouchableOpacity
							onPress={() => void handleUpdateProfilePicture()}
							disabled={isLoading}
							style={{
								backgroundColor: "#FF66B7",
								borderWidth: 2,
								borderBottomWidth: 5,
								borderRightWidth: 5,
								borderColor: "black",
								borderRadius: 16,
								paddingVertical: 14,
								paddingHorizontal: 16,
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 12,
							}}
						>
							<FontAwesomeFreeSolid name="camera" size={20} color="#000" />
							<Text style={styles.text}>Change Profile Picture</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={openPassword}
							disabled={isLoading}
							style={{
								backgroundColor: "#CBEAFF",
								borderWidth: 2,
								borderBottomWidth: 5,
								borderRightWidth: 5,
								borderColor: "black",
								borderRadius: 16,
								paddingVertical: 14,
								paddingHorizontal: 16,
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 12,
							}}
						>
							<FontAwesomeFreeSolid name="lock" size={20} color="#000" />
							<Text style={styles.text}>Change Password</Text>
						</TouchableOpacity>

						{showPasswordInput ? (
							<View>
								<TextInput
									value={currentPassword}
									onChangeText={setCurrentPassword}
									placeholder="Current password"
									secureTextEntry
									style={{
										borderWidth: 2,
										borderColor: "black",
										borderRadius: 12,
										paddingHorizontal: 12,
										paddingVertical: 10,
										fontFamily: "Montserrat-Medium",
										color: "black",
										marginBottom: 8,
									}}
								/>
								<TextInput
									value={newPassword}
									onChangeText={setNewPassword}
									placeholder="New password"
									secureTextEntry
									style={{
										borderWidth: 2,
										borderColor: "black",
										borderRadius: 12,
										paddingHorizontal: 12,
										paddingVertical: 10,
										fontFamily: "Montserrat-Medium",
										color: "black",
										marginBottom: 8,
									}}
								/>
								<TouchableOpacity
									onPress={() => void handleUpdatePassword()}
									disabled={isLoading}
									style={{
										backgroundColor: "#B8E3FF",
										borderWidth: 2,
										borderColor: "black",
										borderBottomWidth: 4,
										borderRightWidth: 4,
										paddingVertical: 10,
										borderRadius: 12,
										alignItems: "center",
										marginBottom: 12,
									}}
								>
									<Text style={{ fontFamily: "Montserrat-Bold" }}>
										Save Password
									</Text>
								</TouchableOpacity>
							</View>
						) : null}

						<TouchableOpacity
							onPress={() => void handleLogout()}
							disabled={isLoading}
							style={{
								backgroundColor: "#FFFFFF",
								borderWidth: 2,
								borderBottomWidth: 5,
								borderRightWidth: 5,
								borderColor: "black",
								borderRadius: 16,
								paddingVertical: 14,
								paddingHorizontal: 16,
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 12,
							}}
						>
							<FontAwesomeFreeSolid name="play" size={18} color="#000" />
							<Text style={styles.text}>Logout</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={handleDeleteAccount}
							disabled={isLoading}
							style={{
								backgroundColor: "#FF66B7",
								borderWidth: 2,
								borderBottomWidth: 5,
								borderRightWidth: 5,
								borderColor: "black",
								borderRadius: 16,
								paddingVertical: 14,
								paddingHorizontal: 16,
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<FontAwesomeFreeSolid name="trash" size={20} color="#000" />
							<Text style={styles.text}>Delete Account</Text>
						</TouchableOpacity>

						{isLoading ? (
							<ActivityIndicator
								size="small"
								color="#000"
								style={{ marginTop: 6 }}
							/>
						) : null}
					</View>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
};

export default Profile;
