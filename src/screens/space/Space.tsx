import {
	isErrorWithCode,
	pick,
	errorCodes as pickerErrorCodes,
	types as pickerTypes,
} from "@react-native-documents/picker";
import FontAwesomeFreeSolid from "@react-native-vector-icons/fontawesome-free-solid";
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import {
	BackHandler,
	Image,
	KeyboardAvoidingView,
	Modal,
	Platform,
	RefreshControl,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Video from "react-native-video";
import {
	deleteMessage,
	getMessages,
	type Message,
	sendMessage,
	toggleMessageAppreciation,
} from "../../api/Messages";
import type { Space as SpaceType } from "../../api/Spaces";
import { getSpaceById, joinSpace as joinSpaceApi } from "../../api/Spaces";
import { useTopic } from "../../context/SpaceContext";
import { useUser } from "../../context/UserContext";
import {
	connectSocket,
	disconnectSocket,
	joinSpace,
	leaveSpace,
	onMessageAppreciated,
	onReceiveMessage,
	sendMessage as sendSocketMessage,
	setMessageAppreciated,
} from "../../sockets/SocketInstance";

const colors = [
	"#FFD60A", // vivid yellow
	"#FF4FA3", // vibrant pink
	"#00CFE8", // strong cyan
	"#8A5CF6", // bright purple
	"#2DD36F", // fresh green
];

const normalizeAppreciationCount = (value: unknown): number => {
	const parsed = typeof value === "number" ? value : Number(value);

	return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeMessageCount = (message: Message): Message => ({
	...message,
	appreciation_count: normalizeAppreciationCount(message.appreciation_count),
});

const dedupeMessagesById = (messages: Message[]): Message[] => {
	const seenMessageIds = new Set<string>();

	return messages.filter((message) => {
		if (!message.message_id || seenMessageIds.has(message.message_id)) {
			return false;
		}

		seenMessageIds.add(message.message_id);
		return true;
	});
};

export const Space = ({ topicId }: { topicId: string }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [space, setSpace] = useState<null | SpaceType>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [messagesLoading, setMessagesLoading] = useState(true);
	const [messageText, setMessageText] = useState("");
	const [messageError, setMessageError] = useState("");
	const [sort, setSort] = useState<"recent" | "most_appreciated">("recent");
	const [sending, setSending] = useState(false);
	const [expandedImages, setExpandedImages] = useState<Record<string, boolean>>(
		{},
	);
	const [selectedMedia, setSelectedMedia] = useState<{
		uri: string;
		name: string;
		type: string;
		mediaType: "image" | "video" | "audio" | null;
	} | null>(null);
	const [showAttachModal, setShowAttachModal] = useState(false);
	const [pendingAttachType, setPendingAttachType] = useState<
		"photo" | "video" | "audio" | null
	>(null);
	const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
	const [audioProgress, setAudioProgress] = useState<Record<string, number>>(
		{},
	);
	const [audioDuration, setAudioDuration] = useState<Record<string, number>>(
		{},
	);
	const [audioEnded, setAudioEnded] = useState<Record<string, boolean>>({});
	const audioRefs = useRef<
		Record<string, { seek?: (seconds: number) => void } | null>
	>({});
	const [refreshing, setRefreshing] = useState(false);
	const [showSortModal, setShowSortModal] = useState(false);
	const [deleteMessageId, setDeleteMessageId] = useState<string | null>(null);
	const { setTopicId } = useTopic();
	const { user } = useUser();

	const handleBack = useCallback(() => {
		setTopicId(null);
	}, [setTopicId]);

	const loadSpace = useCallback(async () => {
		try {
			setIsLoading(true);
			const data = await getSpaceById(topicId);
			setSpace(data);
		} catch (error) {
			console.error("Error fetching space:", error);
		} finally {
			setIsLoading(false);
		}
	}, [topicId]);

	useLayoutEffect(() => {
		loadSpace();
	}, [loadSpace]);

	useEffect(() => {
		const fetchMessagesList = async () => {
			try {
				setMessagesLoading(true);
				setMessageError("");
				const data = await getMessages(topicId, { sort });
				setMessages(
					dedupeMessagesById(data.messages.map(normalizeMessageCount)),
				);
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

	const refreshMessages = useCallback(async () => {
		try {
			setMessagesLoading(true);
			setMessageError("");
			const data = await getMessages(topicId, { sort });
			setMessages(dedupeMessagesById(data.messages.map(normalizeMessageCount)));
		} catch (error) {
			setMessageError(
				error instanceof Error ? error.message : "Failed to fetch messages",
			);
		} finally {
			setMessagesLoading(false);
		}
	}, [topicId, sort]);

	useEffect(() => {
		let unsubscribeReceive = () => {};
		let unsubscribeAppreciation = () => {};

		const setupSocket = async () => {
			try {
				await connectSocket();
				joinSpace(topicId);

				unsubscribeReceive = onReceiveMessage((payload) => {
					if (!payload || typeof payload !== "object") {
						return;
					}

					const payloadRecord = payload as Record<string, unknown>;
					const payloadSpaceId =
						typeof payloadRecord.space_id === "string"
							? payloadRecord.space_id
							: typeof payloadRecord.spaceId === "string"
								? payloadRecord.spaceId
								: undefined;

					const rawMessage =
						typeof payloadRecord.message === "object" && payloadRecord.message
							? (payloadRecord.message as Record<string, unknown>)
							: payloadRecord;

					const messageId =
						typeof rawMessage.message_id === "string"
							? rawMessage.message_id
							: undefined;
					const messageSpaceId =
						typeof rawMessage.space_id === "string"
							? rawMessage.space_id
							: payloadSpaceId;

					if (!messageId || messageSpaceId !== topicId) {
						return;
					}

					const incomingMessage = normalizeMessageCount(rawMessage as Message);

					setMessages((previous: Message[]) => {
						if (previous.some((message) => message.message_id === messageId)) {
							return previous;
						}

						return [incomingMessage, ...previous];
					});
				});

				unsubscribeAppreciation = onMessageAppreciated((payload) => {
					if (!payload || typeof payload !== "object") {
						return;
					}

					const payloadRecord = payload as Record<string, unknown>;
					const appreciationSpaceId =
						typeof payloadRecord.spaceId === "string"
							? payloadRecord.spaceId
							: typeof payloadRecord.space_id === "string"
								? payloadRecord.space_id
								: undefined;
					const appreciationMessageId =
						typeof payloadRecord.messageId === "string"
							? payloadRecord.messageId
							: typeof payloadRecord.message_id === "string"
								? payloadRecord.message_id
								: undefined;
					const appreciationUserId =
						typeof payloadRecord.userId === "string"
							? payloadRecord.userId
							: typeof payloadRecord.user_id === "string"
								? payloadRecord.user_id
								: undefined;
					const appreciated =
						typeof payloadRecord.appreciated === "boolean"
							? payloadRecord.appreciated
							: payloadRecord.appreciated === 1 ||
								payloadRecord.appreciated === "1" ||
								payloadRecord.appreciated === "true";

					if (!appreciationSpaceId || appreciationSpaceId !== topicId) {
						return;
					}

					if (!appreciationMessageId) {
						return;
					}

					if (appreciationUserId && appreciationUserId === user?.user_id) {
						return;
					}

					setMessages((previous: Message[]) =>
						previous.map((message) => {
							if (message.message_id !== appreciationMessageId) return message;

							return {
								...message,
								appreciation_count:
									normalizeAppreciationCount(message.appreciation_count) +
									(appreciated ? 1 : -1),
							};
						}),
					);
				});
			} catch (error) {
				console.error("Socket setup failed:", error);
			}
		};

		setupSocket();

		return () => {
			setPlayingAudioId(null);
			audioRefs.current = {};
			unsubscribeReceive();
			unsubscribeAppreciation();
			leaveSpace(topicId);
			disconnectSocket();
		};
	}, [topicId, user?.user_id]);

	useEffect(() => {
		const subscription = BackHandler.addEventListener(
			"hardwareBackPress",
			() => {
				handleBack();
				return true;
			},
		);

		return () => subscription.remove();
	}, [handleBack]);

	const handleSendMessage = async () => {
		if (!messageText.trim() && !selectedMedia) {
			setMessageError("Type a message or attach media first");
			return;
		}

		const messagePayload = {
			content: messageText,
			media: selectedMedia
				? {
						uri: selectedMedia.uri,
						name: selectedMedia.name,
						type: selectedMedia.type,
					}
				: null,
			media_type: selectedMedia?.mediaType ?? undefined,
		};

		try {
			setSending(true);
			setMessageError("");
			console.log("[Space] Sending message: joining space first", {
				topicId,
				hasText: Boolean(messageText.trim()),
				hasMedia: Boolean(selectedMedia),
			});

			try {
				await joinSpaceApi(topicId);
				console.log("[Space] joinSpace success", { topicId });
			} catch (joinError) {
				const joinMessage =
					joinError instanceof Error ? joinError.message.toLowerCase() : "";
				const alreadyPart =
					joinMessage.includes("already a member") ||
					joinMessage.includes("already part");

				if (!alreadyPart) {
					console.error("[Space] joinSpace failed", {
						topicId,
						joinMessage,
						error: joinError,
					});
					throw joinError;
				}

				console.log("[Space] joinSpace skipped: already part", {
					topicId,
					joinMessage,
				});
			}

			const sentMessage: Message = await sendMessage(topicId, messagePayload);
			console.log("[Space] sendMessage success", {
				topicId,
				messageId: sentMessage.message_id,
			});
			sendSocketMessage({
				spaceId: topicId,
				message: sentMessage,
			});
			setMessageText("");
			setSelectedMedia(null);
			setMessages((previous) =>
				dedupeMessagesById([normalizeMessageCount(sentMessage), ...previous]),
			);
		} catch (error) {
			console.error("[Space] send flow failed", { topicId, error });
			setMessageError(
				error instanceof Error ? error.message : "Failed to send message",
			);
		} finally {
			setSending(false);
		}
	};

	const toggleImageExpand = (messageId: string) => {
		setExpandedImages((previous) => ({
			...previous,
			[messageId]: !previous[messageId],
		}));
	};

	const formatAudioTime = (seconds: number) => {
		if (!Number.isFinite(seconds) || seconds < 0) {
			return "00:00";
		}

		const totalSeconds = Math.floor(seconds);
		const mins = Math.floor(totalSeconds / 60)
			.toString()
			.padStart(2, "0");
		const secs = (totalSeconds % 60).toString().padStart(2, "0");
		return `${mins}:${secs}`;
	};

	const handlePickImageOrVideo = useCallback(
		async (pickerType: "photo" | "video") => {
			try {
				setMessageError("");

				const [file] = await pick({
					type:
						pickerType === "photo" ? [pickerTypes.images] : [pickerTypes.video],
					allowMultiSelection: false,
				});

				if (!file?.uri) {
					setMessageError("Couldn't get media file");
					return;
				}

				setSelectedMedia({
					uri: file.uri,
					name: file.name ?? `upload-${Date.now()}`,
					type:
						file.type ?? (pickerType === "photo" ? "image/jpeg" : "video/mp4"),
					mediaType: pickerType === "photo" ? "image" : "video",
				});
			} catch (error) {
				if (
					isErrorWithCode(error) &&
					error.code === pickerErrorCodes.OPERATION_CANCELED
				) {
					return;
				}

				setMessageError(
					error instanceof Error ? error.message : "Failed to pick media",
				);
			}
		},
		[],
	);

	const handlePickAudio = useCallback(async () => {
		try {
			setMessageError("");

			const [file] = await pick({
				type: [pickerTypes.audio],
				allowMultiSelection: false,
			});

			if (!file.uri) {
				setMessageError("Couldn't get audio file");
				return;
			}

			setSelectedMedia({
				uri: file.uri,
				name: file.name ?? `audio-${Date.now()}`,
				type: file.type ?? "audio/mpeg",
				mediaType: "audio",
			});
		} catch (error) {
			if (
				isErrorWithCode(error) &&
				error.code === pickerErrorCodes.OPERATION_CANCELED
			) {
				return;
			}

			setMessageError(
				error instanceof Error ? error.message : "Failed to pick audio",
			);
		}
	}, []);

	useEffect(() => {
		if (showAttachModal || !pendingAttachType) {
			return;
		}

		const timer = setTimeout(() => {
			if (pendingAttachType === "audio") {
				handlePickAudio();
			} else {
				handlePickImageOrVideo(pendingAttachType);
			}
			setPendingAttachType(null);
		}, 220);

		return () => clearTimeout(timer);
	}, [
		showAttachModal,
		pendingAttachType,
		handlePickAudio,
		handlePickImageOrVideo,
	]);

	const toggleAudioPlayback = (messageId: string) => {
		if (playingAudioId === messageId) {
			setPlayingAudioId(null);
			return;
		}

		if (audioEnded[messageId]) {
			audioRefs.current[messageId]?.seek?.(0);
			setAudioProgress((previous) => ({
				...previous,
				[messageId]: 0,
			}));
			setAudioEnded((previous) => ({
				...previous,
				[messageId]: false,
			}));
		}

		setPlayingAudioId(messageId);
	};

	const handleToggleAppreciation = async (messageId: string) => {
		try {
			setMessageError("");
			const result = await toggleMessageAppreciation(topicId, messageId);
			if (user) {
				setMessageAppreciated({
					spaceId: topicId,
					messageId,
					appreciated: result.appreciated,
					userId: user.user_id,
				});
			}
			setMessages((previous) =>
				previous.map((m) =>
					m.message_id === messageId
						? {
								...m,
								appreciation_count:
									normalizeAppreciationCount(m.appreciation_count) +
									(result.appreciated ? 1 : -1),
							}
						: m,
				),
			);
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
			setMessages((previous) =>
				previous.filter((m) => m.message_id !== messageId),
			);
		} catch (error) {
			setMessageError(
				error instanceof Error ? error.message : "Failed to delete message",
			);
		}
	};

	const onRefresh = async () => {
		setRefreshing(true);
		await Promise.all([loadSpace(), refreshMessages()]);
		setRefreshing(false);
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1, backgroundColor: colors[4] }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<Modal
				transparent
				animationType="fade"
				visible={showAttachModal}
				onRequestClose={() => {
					setPendingAttachType(null);
					setShowAttachModal(false);
				}}
			>
				<TouchableOpacity
					activeOpacity={1}
					onPress={() => {
						setPendingAttachType(null);
						setShowAttachModal(false);
					}}
					style={{
						flex: 1,
						backgroundColor: "rgba(0, 0, 0, 0.2)",
						justifyContent: "flex-end",
					}}
				>
					<View
						style={{
							backgroundColor: "white",
							borderTopLeftRadius: 18,
							borderTopRightRadius: 18,
							padding: 14,
							borderWidth: 2,
							borderColor: "black",
						}}
					>
						<Text
							style={{
								fontFamily: "Montserrat-ExtraBold",
								fontSize: 18,
								color: "black",
								marginBottom: 10,
							}}
						>
							Attach media
						</Text>

						<TouchableOpacity
							onPress={() => {
								setPendingAttachType("photo");
								setShowAttachModal(false);
							}}
							style={{
								borderWidth: 2,
								borderColor: "black",
								borderRadius: 12,
								paddingVertical: 10,
								paddingHorizontal: 12,
								marginBottom: 8,
								backgroundColor: "#E7F5FF",
							}}
						>
							<Text style={{ fontFamily: "Montserrat-Bold", color: "black" }}>
								Image
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => {
								setPendingAttachType("video");
								setShowAttachModal(false);
							}}
							style={{
								borderWidth: 2,
								borderColor: "black",
								borderRadius: 12,
								paddingVertical: 10,
								paddingHorizontal: 12,
								marginBottom: 8,
								backgroundColor: "#FFF3BF",
							}}
						>
							<Text style={{ fontFamily: "Montserrat-Bold", color: "black" }}>
								Video
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => {
								setPendingAttachType("audio");
								setShowAttachModal(false);
							}}
							style={{
								borderWidth: 2,
								borderColor: "black",
								borderRadius: 12,
								paddingVertical: 10,
								paddingHorizontal: 12,
								backgroundColor: "#E6FCF5",
							}}
						>
							<Text style={{ fontFamily: "Montserrat-Bold", color: "black" }}>
								Audio
							</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Modal>

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
						onPress={handleBack}
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
			<ScrollView
				contentContainerStyle={{ flexGrow: 1 }}
				style={{ flex: 1 }}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
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
										<TouchableOpacity
											onPress={() => toggleImageExpand(message.message_id)}
											activeOpacity={0.9}
										>
											<Image
												style={{
													width: "100%",
													height: expandedImages[message.message_id]
														? 320
														: 180,
													borderRadius: 12,
													marginTop: 4,
													marginBottom: 6,
												}}
												resizeMode={
													expandedImages[message.message_id]
														? "contain"
														: "cover"
												}
												source={{ uri: message.media_url }}
											/>
											<Text
												style={{
													fontFamily: "Montserrat-Regular",
													color: "#495057",
													marginBottom: 10,
												}}
											>
												{expandedImages[message.message_id]
													? "Tap image to collapse"
													: "Tap image to expand"}
											</Text>
										</TouchableOpacity>
									) : null}

									{message.media_url && message.media_type === "video" ? (
										<View
											style={{
												borderRadius: 12,
												overflow: "hidden",
												marginTop: 4,
												marginBottom: 10,
												backgroundColor: "black",
											}}
										>
											<Video
												source={{ uri: message.media_url }}
												style={{ width: "100%", height: 220 }}
												controls
												resizeMode="cover"
												paused
											/>
										</View>
									) : null}

									{message.media_url && message.media_type === "audio" ? (
										<View
											style={{
												borderWidth: 2,
												borderColor: "black",
												borderRadius: 12,
												padding: 8,
												marginTop: 4,
												marginBottom: 10,
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
												<TouchableOpacity
													onPress={() =>
														toggleAudioPlayback(message.message_id)
													}
													style={{
														borderWidth: 2,
														borderColor: "black",
														borderRadius: 10,
														paddingHorizontal: 10,
														paddingVertical: 6,
														backgroundColor: "#E7F5FF",
														marginRight: 10,
													}}
												>
													<Text
														style={{
															fontFamily: "Montserrat-Bold",
															color: "black",
														}}
													>
														{playingAudioId === message.message_id
															? "Pause"
															: "Play"}
													</Text>
												</TouchableOpacity>
												<Text
													style={{
														fontFamily: "Montserrat-Bold",
														color: "black",
													}}
												>
													{formatAudioTime(
														audioProgress[message.message_id] ?? 0,
													)}{" "}
													/{" "}
													{formatAudioTime(
														audioDuration[message.message_id] ?? 0,
													)}
												</Text>
											</View>

											<View
												style={{
													height: 8,
													borderRadius: 999,
													backgroundColor: "#DEE2E6",
													overflow: "hidden",
													marginBottom: 8,
												}}
											>
												<View
													style={{
														height: 8,
														width: `${Math.min(
															100,
															((audioProgress[message.message_id] ?? 0) /
																Math.max(
																	audioDuration[message.message_id] ?? 1,
																	1,
																)) *
																100,
														)}%`,
														backgroundColor: "#339AF0",
													}}
												/>
											</View>

											<Video
												ref={(reference) => {
													audioRefs.current[message.message_id] = reference;
												}}
												source={{ uri: message.media_url }}
												style={{ width: 1, height: 1, opacity: 0 }}
												paused={playingAudioId !== message.message_id}
												onLoad={(event) => {
													setAudioDuration((previous) => ({
														...previous,
														[message.message_id]: event.duration,
													}));
													setAudioEnded((previous) => ({
														...previous,
														[message.message_id]: false,
													}));
												}}
												onProgress={(event) => {
													setAudioProgress((previous) => ({
														...previous,
														[message.message_id]: event.currentTime,
													}));
													setAudioEnded((previous) => ({
														...previous,
														[message.message_id]: false,
													}));
												}}
												onEnd={() => {
													setPlayingAudioId(null);
													setAudioProgress((previous) => ({
														...previous,
														[message.message_id]:
															audioDuration[message.message_id] ??
															previous[message.message_id] ??
															0,
													}));
													setAudioEnded((previous) => ({
														...previous,
														[message.message_id]: true,
													}));
												}}
											/>
										</View>
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
												👍{" "}
												{normalizeAppreciationCount(message.appreciation_count)}
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

			{selectedMedia ? (
				<View
					style={{
						backgroundColor: "white",
						borderLeftWidth: 2,
						borderRightWidth: 2,
						borderTopWidth: 2,
						borderColor: "black",
						paddingHorizontal: 10,
						paddingVertical: 8,
					}}
				>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							columnGap: 10,
						}}
					>
						{selectedMedia.mediaType === "image" ? (
							<Image
								source={{ uri: selectedMedia.uri }}
								style={{
									width: 44,
									height: 44,
									borderRadius: 8,
									borderWidth: 1,
								}}
							/>
						) : selectedMedia.mediaType === "video" ? (
							<View
								style={{
									width: 96,
									height: 64,
									borderRadius: 8,
									overflow: "hidden",
									backgroundColor: "black",
								}}
							>
								<Video
									source={{ uri: selectedMedia.uri }}
									style={{ width: "100%", height: "100%" }}
									paused
									resizeMode="cover"
								/>
							</View>
						) : selectedMedia.mediaType === "audio" ? (
							<View
								style={{
									width: 96,
									height: 64,
									borderRadius: 8,
									borderWidth: 1,
									alignItems: "center",
									justifyContent: "center",
									backgroundColor: "#F1F3F5",
								}}
							>
								<Text style={{ color: "black", fontFamily: "Montserrat-Bold" }}>
									AUDIO
								</Text>
							</View>
						) : (
							<View
								style={{
									width: 44,
									height: 44,
									borderRadius: 8,
									borderWidth: 1,
									alignItems: "center",
									justifyContent: "center",
									backgroundColor: "#F1F3F5",
								}}
							>
								<Text style={{ color: "black", fontFamily: "Montserrat-Bold" }}>
									{selectedMedia.mediaType === "video"
										? "VID"
										: selectedMedia.mediaType === "audio"
											? "AUD"
											: "FILE"}
								</Text>
							</View>
						)}
						<View style={{ flex: 1 }}>
							<Text
								numberOfLines={1}
								style={{ fontFamily: "Montserrat-Bold", color: "black" }}
							>
								{selectedMedia.name}
							</Text>
							<Text
								style={{ fontFamily: "Montserrat-Regular", color: "black" }}
							>
								Attached {selectedMedia.mediaType ?? "media"}
							</Text>
						</View>
						<TouchableOpacity
							onPress={() => setSelectedMedia(null)}
							style={{
								borderWidth: 2,
								borderColor: "black",
								borderRadius: 10,
								paddingHorizontal: 10,
								paddingVertical: 6,
								backgroundColor: "#FFE3E3",
							}}
						>
							<Text style={{ fontFamily: "Montserrat-Bold", color: "black" }}>
								Remove
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			) : null}

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
				<TouchableOpacity
					onPress={() => setShowAttachModal(true)}
					disabled={sending}
					style={{
						backgroundColor: sending ? "#F1F3F5" : "#E7F5FF",
						paddingHorizontal: 12,
						paddingVertical: 10,
						borderRadius: 12,
						borderWidth: 2,
						borderColor: "black",
						marginRight: 8,
					}}
				>
					<Text style={{ fontFamily: "Montserrat-Bold", color: "black" }}>
						Media
					</Text>
				</TouchableOpacity>
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
