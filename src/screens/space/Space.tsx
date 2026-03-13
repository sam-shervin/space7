import FontAwesomeFreeSolid from "@react-native-vector-icons/fontawesome-free-solid";
import { useEffect, useLayoutEffect, useState } from "react";
import {
	Image,
	KeyboardAvoidingView,
	Platform,
	Modal,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import {
	deleteMessage,
	getMessages,
	type Message,
	sendMessage,
	toggleMessageAppreciation,
} from "../../api/Messages";
import type { Space as SpaceType } from "../../api/Spaces";
import { getSpaceById, joinSpace } from "../../api/Spaces";
import { useTopic } from "../../context/SpaceContext";
import { useUser } from "../../context/UserContext";

const colors = [
	"#FFD60A", // vivid yellow
	"#FF4FA3", // vibrant pink
	"#00CFE8", // strong cyan
	"#8A5CF6", // bright purple
	"#2DD36F", // fresh green
];

export const Space = ({ topicId }: { topicId: string }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [space, setSpace] = useState<null | SpaceType>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [messagesLoading, setMessagesLoading] = useState(true);
	const [messageText, setMessageText] = useState("");
	const [messageError, setMessageError] = useState("");
	const [sort, setSort] = useState<"recent" | "most_appreciated">("recent");
	const [sending, setSending] = useState(false);
	const [showSortModal, setShowSortModal] = useState(false);
	const [deleteMessageId, setDeleteMessageId] = useState<string | null>(null);
	const { setTopicId } = useTopic();
	const { user } = useUser();

	useLayoutEffect(() => {
		const fetchSpace = async () => {
			try {
				setIsLoading(true);
				const space = await getSpaceById(topicId);
				console.log(space);
				setSpace(space);
			} catch (error) {
				console.error("Error fetching space:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchSpace();
	}, [topicId]);

	useEffect(() => {
		const fetchMessagesList = async () => {
			try {
				setMessagesLoading(true);
				setMessageError("");
				const data = await getMessages(topicId, { sort });
				setMessages(data.messages);
			} catch (error) {
				setMessageError(
					error instanceof Error ? error.message : "Failed to fetch messages",
				);
			} finally {
				setMessagesLoading(false);
			}
		};

		fetchMessagesList();
	}, [topicId, sort]);

	const refreshMessages = async () => {
		try {
			setMessagesLoading(true);
			setMessageError("");
			const data = await getMessages(topicId, { sort });
			setMessages(data.messages);
		} catch (error) {
			setMessageError(
				error instanceof Error ? error.message : "Failed to fetch messages",
			);
		} finally {
			setMessagesLoading(false);
		}
	};

	const handleSendMessage = async () => {
		if (!messageText.trim()) {
			setMessageError("Type a message first");
			return;
		}

		try {
			setSending(true);
			setMessageError("");

			if (space?.visibility === "public") {
				try {
					await joinSpace(topicId);
				} catch (joinError) {
					const joinMessage =
						joinError instanceof Error ? joinError.message.toLowerCase() : "";

					if (!joinMessage.includes("already a member")) {
						throw joinError;
					}
				}
			}

			await sendMessage(topicId, { content: messageText });
			setMessageText("");
			await refreshMessages();
		} catch (error) {
			setMessageError(
				error instanceof Error ? error.message : "Failed to send message",
			);
		} finally {
			setSending(false);
		}
	};

	const handleToggleAppreciation = async (messageId: string) => {
		try {
			setMessageError("");
			await toggleMessageAppreciation(topicId, messageId);
			await refreshMessages();
		} catch (error) {
			setMessageError(
				error instanceof Error ? error.message : "Failed to appreciate message",
			);
		}
	};

	const handleDeleteMessage = async (messageId: string) => {
		try {
			setMessageError("");
			await deleteMessage(topicId, messageId);
			setDeleteMessageId(null);
			await refreshMessages();
		} catch (error) {
			setMessageError(
				error instanceof Error ? error.message : "Failed to delete message",
			);
		}
	};
	return (
<KeyboardAvoidingView
	style={{ flex: 1, backgroundColor: colors[4] }}
	behavior={Platform.OS === "ios" ? "padding" : "height"}
>
			<Modal
				transparent
				animationType="fade"
				visible={deleteMessageId !== null}
				onRequestClose={() => setDeleteMessageId(null)}
			>
				<TouchableOpacity
					activeOpacity={1}
					onPress={() => setDeleteMessageId(null)}
					style={{
						flex: 1,
						backgroundColor: "rgba(0, 0, 0, 0.2)",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<View
						style={{
							backgroundColor: "white",
							borderWidth: 2,
							borderColor: "black",
							borderRadius: 16,
							padding: 16,
							width: 280,
						}}
					>
						<Text
							style={{
								fontFamily: "Montserrat-ExtraBold",
								fontSize: 18,
								color: "black",
								marginBottom: 8,
							}}
						>
							Delete message?
						</Text>
						<Text
							style={{
								fontFamily: "Montserrat-Medium",
								color: "black",
								marginBottom: 16,
							}}
						>
							Are you sure you want to delete this message?
						</Text>
						<View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
							<TouchableOpacity
								onPress={() => setDeleteMessageId(null)}
								style={{
									paddingHorizontal: 12,
									paddingVertical: 8,
									borderRadius: 12,
									borderWidth: 2,
									borderColor: "black",
									marginRight: 8,
									backgroundColor: "#F1F3F5",
								}}
							>
								<Text style={{ fontFamily: "Montserrat-Bold", color: "black" }}>
									Cancel
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									if (deleteMessageId) {
										handleDeleteMessage(deleteMessageId);
									}
								}}
								style={{
									paddingHorizontal: 12,
									paddingVertical: 8,
									borderRadius: 12,
									borderWidth: 2,
									borderColor: "black",
									backgroundColor: "#FFCDD2",
								}}
							>
								<Text style={{ fontFamily: "Montserrat-Bold", color: "black" }}>
									Delete
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</TouchableOpacity>
			</Modal>
			<Modal
				transparent
				animationType="fade"
				visible={showSortModal}
				onRequestClose={() => setShowSortModal(false)}
			>
				<TouchableOpacity
					activeOpacity={1}
					onPress={() => setShowSortModal(false)}
					style={{
						flex: 1,
						backgroundColor: "rgba(0, 0, 0, 0.2)",
						justifyContent: "flex-start",
					}}
				>
					<View
						style={{
							position: "absolute",
							right: 10,
							marginTop: 80,
							marginLeft: 20,
							backgroundColor: "white",
							borderWidth: 2,
							borderColor: "black",
							borderRadius: 16,
							padding: 12,
							width: 180,
						}}
					>
						<TouchableOpacity
							onPress={() => {
								setSort("recent");
								setShowSortModal(false);
							}}
							style={{
								backgroundColor: sort === "recent" ? "#FFD60A" : "#F1F3F5",
								paddingHorizontal: 12,
								paddingVertical: 8,
								borderRadius: 12,
								borderWidth: 2,
								borderColor: "black",
								marginBottom: 8,
							}}
						>
							<Text style={{ fontFamily: "Montserrat-Bold", color: "black" }}>
								Recent
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								setSort("most_appreciated");
								setShowSortModal(false);
							}}
							style={{
								backgroundColor:
									sort === "most_appreciated" ? "#FF4FA3" : "#F1F3F5",
								paddingHorizontal: 12,
								paddingVertical: 8,
								borderRadius: 12,
								borderWidth: 2,
								borderColor: "black",
							}}
						>
							<Text style={{ fontFamily: "Montserrat-Bold", color: "black" }}>
								Top
							</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Modal>
			<View
				style={{
					flexDirection: "row",

					alignItems: "center",
					justifyContent: "space-between",
					paddingHorizontal: 10,
					borderBottomWidth: 3,
				}}
			>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<FontAwesomeFreeSolid
						style={{
							borderWidth: 3,
							borderColor: "black",
							borderRadius: 10,
							margin: 10,
							paddingHorizontal: 5,
							borderBottomWidth: 5,
							borderRightWidth: 5,
							backgroundColor: "yellow",
						}}
						name="arrow-left"
						size={32}
						onPress={() => setTopicId(null)}
					/>

					<Text
						style={{
							fontFamily: "Montserrat-ExtraBoldItalic",
							fontSize: 32,
							color: "black",
							marginLeft: 5,
						}}
					>
						space
					</Text>
					<Text
						style={{
							fontFamily: "Montserrat-ExtraBoldItalic",
							fontSize: 32,
							color: "white",
							textShadowColor: "black",
							textShadowOffset: { width: 0, height: 0 },
							textShadowRadius: 5,
						}}
					>
						7
					</Text>
				</View>

				<FontAwesomeFreeSolid
					style={{ margin: 10, paddingHorizontal: 5 }}
					name="ellipsis-h"
					size={32}
					onPress={() => setShowSortModal(true)}
				/>
			</View>
			<ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
				<View style={{ padding: 10 }}>
					{isLoading ? (
						<Text
							style={{
								fontFamily: "Montserrat-ExtraBold",
								fontSize: 24,
								color: "black",
								marginTop: 10,
							}}
						>
							Loading...
						</Text>
					) : (
						<Text
							style={{
								fontFamily: "Montserrat-ExtraBold",
								fontSize: 24,
								color: "black",
								marginTop: 10,
							}}
						>
							{space?.title}
						</Text>
					)}

					{isLoading ? (
						<Text>Loading...</Text>
					) : (
						<Text
							style={{
								fontFamily: "Montserrat-Regular",
								fontSize: 16,
								color: "black",
							}}
						>
							{space?.description}
						</Text>
					)}
					{isLoading ? (
						<Text>Loading...</Text>
					) : (
						<View
							style={{
								flexDirection: "row",
								flexWrap: "wrap",
								alignItems: "center",
							}}
						>
							{space?.creator?.profile_picture ? (
								<Image
									style={{
										width: 30,
										height: 30,
										borderRadius: 100,
										margin: 5,
									}}
									source={{ uri: space.creator.profile_picture }}
								/>
							) : (
								<View
									style={{
										width: 30,
										height: 30,
										borderRadius: 100,
										margin: 5,
										backgroundColor: "white",
									}}
								/>
							)}
							<Text>@{space?.creator?.username}</Text>
						</View>
					)}
				</View>
				<View
					style={{
						flexDirection: "row",
						flexWrap: "wrap",
						borderTopEndRadius: 50,
						borderWidth: 2,
						backgroundColor: "white",
						padding: 5,
						flex: 1,
					}}
				>
					<View style={{ width: "100%", padding: 10 }}>
						<Text
							style={{
								fontFamily: "Montserrat-Bold",
								color: "black",
								marginBottom: 12,
							}}
						>
							Sorted by: {sort === "recent" ? "Recent" : "Top"}
						</Text>

						{messagesLoading ? (
							<Text style={{ fontFamily: "Montserrat-Bold", color: "black" }}>
								Loading messages...
							</Text>
						) : messages.length === 0 ? (
							<Text style={{ fontFamily: "Montserrat-Bold", color: "black" }}>
								No messages yet. Start the conversation.
							</Text>
						) : (
							messages.map((message) => (
								<View
									key={message.message_id}
									style={{
										borderWidth: 2,
										borderColor: "black",
										borderRadius: 16,
										padding: 12,
										marginBottom: 12,
										backgroundColor: "#F8F9FA",
									}}
								>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											marginBottom: 8,
										}}
									>
										<Text
											style={{ fontFamily: "Montserrat-Bold", color: "black" }}
										>
											@{message.sender.username}
										</Text>
										<Text
											style={{
												marginLeft: "auto",
												fontFamily: "Montserrat-Regular",
												color: "black",
											}}
										>
											{new Date(message.created_at).toLocaleString()}
										</Text>
									</View>

									{message.content ? (
										<Text
											style={{
												fontFamily: "Montserrat-Regular",
												fontSize: 15,
												color: "black",
												marginBottom: message.media_url ? 10 : 0,
											}}
										>
											{message.content}
										</Text>
									) : null}

									{message.media_url && message.media_type === "image" ? (
										<Image
											style={{
												width: "100%",
												height: 180,
												borderRadius: 12,
												marginTop: 4,
												marginBottom: 10,
											}}
											source={{ uri: message.media_url }}
										/>
									) : null}

									{message.media_url && message.media_type !== "image" ? (
										<Text
											style={{
												fontFamily: "Montserrat-Bold",
												color: "#1C7ED6",
												marginBottom: 10,
											}}
										>
											Media attached: {message.media_type}
										</Text>
									) : null}

									<View style={{ flexDirection: "row", alignItems: "center" }}>
										<TouchableOpacity
											onPress={() =>
												handleToggleAppreciation(message.message_id)
											}
											style={{
												backgroundColor: "white",
												paddingHorizontal: 10,
												paddingVertical: 6,
												borderRadius: 12,
												borderWidth: 2,
												borderColor: "black",
												marginRight: 8,
											}}
										>
											<Text
												style={{
													fontFamily: "Montserrat-Bold",
													color: "black",
												}}
											>
												👍 {message.appreciation_count}
											</Text>
										</TouchableOpacity>

										{user && message.sender_id === user.user_id ? (
											<TouchableOpacity
												onPress={() => setDeleteMessageId(message.message_id)}
												style={{
													backgroundColor: "#FFCDD2",
													paddingHorizontal: 10,
													paddingVertical: 6,
													borderRadius: 12,
													borderWidth: 2,
													borderColor: "black",
												}}
											>
												<Text
													style={{
														fontFamily: "Montserrat-Bold",
														color: "black",
													}}
												>
													Delete
												</Text>
											</TouchableOpacity>
										) : null}
									</View>
								</View>
							))
						)}

						{messageError ? (
							<Text
								style={{
									fontFamily: "Montserrat-Bold",
									color: "#C2255C",
									marginBottom: 10,
								}}
							>
								{messageError}
							</Text>
						) : null}
					</View>
				</View>
			</ScrollView>
			
<View
	style={{
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 10,
		paddingTop: 10,
		paddingBottom: 14,
		backgroundColor: colors[0],
		borderLeftWidth: 2,
		borderRightWidth: 2,
	}}
>
				<TextInput
					value={messageText}
					onChangeText={setMessageText}
					placeholder="Write a message..."
					placeholderTextColor="#868E96"
					style={{
						flex: 1,
						backgroundColor: "#F1F3F5",
						borderWidth: 2,
						borderColor: "black",
						borderRadius: 12,
						paddingHorizontal: 12,
						paddingVertical: 10,
						fontFamily: "Montserrat-Medium",
						color: "black",
					}}
				/>
				<TouchableOpacity
					onPress={handleSendMessage}
					disabled={sending}
					style={{
						backgroundColor: sending ? "#FFE8A1" : "#FFD60A",
						paddingHorizontal: 14,
						paddingVertical: 10,
						borderRadius: 12,
						borderWidth: 2,
						borderColor: "black",
						marginLeft: 8,
					}}
				>
					<Text style={{ fontFamily: "Montserrat-Bold", color: "black" }}>
						{sending ? "Sending..." : "Send"}
					</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
};
