import FontAwesomeFreeSolid from "@react-native-vector-icons/fontawesome-free-solid";
import { useCallback, useEffect, useState } from "react";
import {
	BackHandler,
	FlatList,
	RefreshControl,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import {
	getNotifications,
	markAllNotificationsAsRead,
	markNotificationAsRead,
	type Notification,
} from "../../api/Notifications";

type NotificationsScreenProps = {
	onClose: () => void;
};

const NotificationsScreen = ({ onClose }: NotificationsScreenProps) => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [unreadCount, setUnreadCount] = useState(0);
	const [deviceLocale, setDeviceLocale] = useState("en-US");
	const [deviceTimeZone, setDeviceTimeZone] = useState("UTC");

	const handleBack = useCallback(() => {
		onClose();
	}, [onClose]);

	const getNotificationId = (item: Notification) => {
		if (item.id !== null && item.id !== undefined) {
			return item.id;
		}

		const fallbackId = (item as Notification & { notification_id?: number })
			.notification_id;
		return fallbackId;
	};

	const loadNotifications = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await getNotifications(1, 30);
			setNotifications(data.notifications);
			setUnreadCount(data.unreadCount);
		} catch (loadError) {
			setError(
				loadError instanceof Error
					? loadError.message
					: "Failed to load notifications",
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const loadInitialNotifications = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await getNotifications(1, 30);
				setNotifications(data.notifications);
				setUnreadCount(data.unreadCount);
			} catch (loadError) {
				setError(
					loadError instanceof Error
						? loadError.message
						: "Failed to load notifications",
				);
			} finally {
				setLoading(false);
			}
		};

		const locale = Intl.DateTimeFormat().resolvedOptions().locale;
		const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

		if (locale) {
			setDeviceLocale(locale);
		}

		if (timeZone) {
			setDeviceTimeZone(timeZone);
		}

		loadInitialNotifications();
	}, []);

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

	const handleRefresh = async () => {
		setRefreshing(true);
		await loadNotifications();
		setRefreshing(false);
	};

	const handleMarkAllAsRead = async () => {
		try {
			setError(null);
			await markAllNotificationsAsRead();
			const updatedNotifications = notifications.map((item) => {
				return {
					...item,
					is_read: true,
				};
			});
			setNotifications(updatedNotifications);
			setUnreadCount(0);
		} catch (markError) {
			setError(
				markError instanceof Error
					? markError.message
					: "Failed to mark all notifications as read",
			);
		}
	};

	const handleOpenNotification = async (item: Notification) => {
		try {
			setError(null);
			const notificationId = getNotificationId(item);

			if (
				!item.is_read &&
				notificationId !== null &&
				notificationId !== undefined
			) {
				await markNotificationAsRead(notificationId);
				setNotifications((previous) =>
					previous.map((notificationItem) => {
						const currentId = getNotificationId(notificationItem);

						if (currentId === notificationId) {
							return {
								...notificationItem,
								is_read: true,
							};
						}

						return notificationItem;
					}),
				);
				setUnreadCount((currentCount) => {
					if (currentCount <= 0) {
						return 0;
					}
					return currentCount - 1;
				});
			}
		} catch (openError) {
			setError(
				openError instanceof Error
					? openError.message
					: "Failed to open notification",
			);
		}
	};

	const getNotificationDateTimeText = (createdAt: string) => {
		const createdDate = new Date(createdAt);
		return createdDate.toLocaleString(deviceLocale, {
			timeZone: deviceTimeZone,
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit",
		});
	};

	const renderNotification = ({ item }: { item: Notification }) => {
		const handlePress = handleOpenNotification.bind(null, item);
		const dateTimeText = getNotificationDateTimeText(item.created_at);
		const cardBackground = item.is_read ? "#FFFDF7" : "#DDEBFF";

		return (
			<TouchableOpacity
				activeOpacity={1}
				onPress={handlePress}
				style={{
					backgroundColor: cardBackground,
					paddingHorizontal: 16,
					paddingTop: 14,
					paddingBottom: 12,
					borderTopWidth: 1,
					borderBottomWidth: 1,
					borderColor: "#A5A9B2",
				}}
			>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<Text
						style={{
							fontFamily: "Montserrat-ExtraBold",
							fontSize: 22,
							color: "black",
						}}
					>
						{item.type === "message_appreciated"
							? "Your Message Received Appreciations!"
							: "New Notification"}
					</Text>
					<Text
						style={{
							marginLeft: "auto",
							fontFamily: "Montserrat-Medium",
							color: "black",
							fontSize: 12,
						}}
					>
						{item.is_read ? "Read" : "New"}
					</Text>
				</View>
				<Text
					style={{
						marginTop: 8,
						fontFamily: "Montserrat-Medium",
						color: "black",
						fontSize: 16,
					}}
				>
					{item.message}
				</Text>
				<View style={{ flexDirection: "row", marginTop: 10 }}>
					<Text
						style={{
							fontFamily: "Montserrat-Regular",
							fontSize: 14,
							color: "#555",
						}}
					>
						{dateTimeText}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};

	const getNotificationKey = (item: Notification, index: number) => {
		const notificationId = getNotificationId(item);

		if (notificationId === null || notificationId === undefined) {
			const referenceId = item.reference_id || "notification";
			const createdAt = item.created_at || "unknown-time";
			return `${referenceId}-${createdAt}-${index}`;
		}

		return String(notificationId);
	};

	return (
		<View style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
			<View
				style={{
					paddingTop: 30,
					backgroundColor: "#27A6FD",
					paddingBottom: 10,
					borderBottomWidth: 3,
					borderColor: "black",
				}}
			>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						paddingHorizontal: 15,
					}}
				>
					<TouchableOpacity
						onPress={handleBack}
						style={{
							borderWidth: 3,
							borderColor: "black",
							borderRadius: 10,
							paddingHorizontal: 5,
							paddingVertical: 3,
							borderBottomWidth: 5,
							borderRightWidth: 5,
							backgroundColor: "yellow",
						}}
					>
						<FontAwesomeFreeSolid name="arrow-left" size={24} color="#000000" />
					</TouchableOpacity>
					<Text
						style={{
							fontFamily: "Montserrat-ExtraBold",
							fontSize: 28,
							marginLeft: 12,
							color: "white",
						}}
					>
						Notifications
					</Text>
					<View
						style={{
							marginLeft: "auto",
							backgroundColor: "#FB3498",
							paddingHorizontal: 10,
							paddingVertical: 4,
							borderRadius: 12,
							borderWidth: 2,
							borderColor: "black",
						}}
					>
						<Text style={{ fontFamily: "Montserrat-Bold", color: "black" }}>
							Unread: {unreadCount}
						</Text>
					</View>
				</View>
			</View>

			<View
				style={{
					paddingHorizontal: 12,
					paddingVertical: 10,
					backgroundColor: "#FDFDFB",
					borderBottomWidth: 2,
					borderColor: "black",
				}}
			>
				<TouchableOpacity
					onPress={handleMarkAllAsRead}
					style={{
						backgroundColor: "#FFD60A",
						paddingHorizontal: 12,
						paddingVertical: 8,
						borderRadius: 12,
						borderWidth: 2,
						borderColor: "black",
						alignSelf: "flex-start",
					}}
				>
					<Text style={{ fontFamily: "Montserrat-Bold", color: "black" }}>
						Mark all as read
					</Text>
				</TouchableOpacity>
			</View>

			{error ? (
				<Text
					style={{
						paddingHorizontal: 12,
						paddingVertical: 10,
						fontFamily: "Montserrat-Bold",
						color: "#C2255C",
					}}
				>
					{error}
				</Text>
			) : null}

			{loading ? (
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Text style={{ fontFamily: "Montserrat-Bold", color: "black" }}>
						Loading notifications...
					</Text>
				</View>
			) : (
				<FlatList
					data={notifications}
					renderItem={renderNotification}
					keyExtractor={getNotificationKey}
					contentContainerStyle={{ paddingBottom: 100 }}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
					}
					ListEmptyComponent={
						<Text
							style={{
								paddingHorizontal: 12,
								paddingVertical: 16,
								fontFamily: "Montserrat-Medium",
								color: "black",
							}}
						>
							No notifications yet.
						</Text>
					}
				/>
			)}
		</View>
	);
};

export default NotificationsScreen;
