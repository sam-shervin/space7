import FontAwesomeFreeSolid from "@react-native-vector-icons/fontawesome-free-solid";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PlatformPressable, Text } from "@react-navigation/elements";
import {
	createStaticNavigation,
	useLinkBuilder,
} from "@react-navigation/native";
import { useRef, useState } from "react";
import { ActivityIndicator, Animated, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { TopicContext } from "./src/context/SpaceContext";
import { UserProvider, useUser } from "./src/context/UserContext";
import AuthScreen from "./src/screens/auth/AuthScreen";
import Home from "./src/screens/home/Home";
import MyDiscussions from "./src/screens/my-discussions/MyDiscussions";
import MyProfile from "./src/screens/my-profile/MyProfile";
import NewTopic from "./src/screens/new-topic/NewTopic";
import { Space } from "./src/screens/space/Space";

const Tab = createBottomTabNavigator({
	tabBar: (props) => <MyTabBar {...props} />,
	screenOptions: {
		headerShown: false,
	},
	screens: {
		Home: {
			screen: Home,
			options: {
				tabBarLabel: "Home",
				tabBarIcon: ({ focused }) => (
					<View
						style={{
							alignItems: "center",
							justifyContent: "center",
							paddingVertical: 5,
							paddingHorizontal: 20,
							transform: [{ scale: 1.1 }],
							position: "relative",
							bottom: 5,
						}}
					>
						<FontAwesomeFreeSolid
							name="home"
							size={25}
							color={focused ? "#7F00FF" : "#000000"}
						/>
					</View>
				),
			},
		},

		NewTopic: {
			screen: NewTopic,
			options: {
				tabBarLabel: "New Topic",
				tabBarIcon: () => (
					<View
						style={{
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "#FF4FA3",
							borderRadius: 10,
							borderWidth: 2,
							borderBottomWidth: 4,
							paddingVertical: 5,
							paddingHorizontal: 20,
							transform: [{ scale: 1 }, { rotate: "-5deg" }],
							position: "relative",
							bottom: 5,
						}}
					>
						<FontAwesomeFreeSolid
							name="plus"
							size={25}
							color={"#000000"}
							style={{ transform: [{ rotate: "5deg" }] }}
						/>
					</View>
				),
			},
		},

		MyDiscussions: {
			screen: MyDiscussions,

			options: {
				tabBarLabel: "My Discussions",
				tabBarIcon: ({ focused }) => (
					<View
						style={{
							alignItems: "center",
							justifyContent: "center",
							paddingVertical: 5,
							paddingHorizontal: 20,
							transform: [{ scale: 1.1 }],
							position: "relative",
							bottom: 5,
						}}
					>
						<FontAwesomeFreeSolid
							name="comments"
							size={25}
							color={focused ? "#1C7ED6" : "#000000"}
						/>
					</View>
				),
			},
		},

		MyProfile: {
			screen: MyProfile,
			options: {
				tabBarLabel: "My Profile",
				tabBarIcon: ({ focused }) => (
					<View
						style={{
							alignItems: "center",
							justifyContent: "center",
							paddingVertical: 5,
							paddingHorizontal: 20,
							transform: [{ scale: 1.1 }],
							position: "relative",
							bottom: 5,
						}}
					>
						<FontAwesomeFreeSolid
							name="user"
							size={25}
							color={focused ? "#1cbf5dff" : "#000000"}
						/>
					</View>
				),
			},
		},
	},
});

function MyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
	const { buildHref } = useLinkBuilder();
	const pressAnims = useRef(
		state.routes.map(() => new Animated.Value(0)),
	).current;

	return (
		<View
			style={{
				flexDirection: "row",
				backgroundColor: "white",
				marginHorizontal: 10,
				borderRadius: 20,
				borderColor: "black",
				borderWidth: 2,
				position: "absolute",
				bottom: 10,
				left: 10,
				right: 10,
				borderBottomWidth: 5,
			}}
		>
			{state.routes.map((route, index: number) => {
				const pressAnim = pressAnims[index];
				const animatePress = () => {
					Animated.sequence([
						Animated.timing(pressAnim, {
							toValue: -10,
							duration: 100,
							useNativeDriver: true,
						}),
						Animated.timing(pressAnim, {
							toValue: 0,
							duration: 300,
							useNativeDriver: true,
						}),
					]).start();
				};
				const { options } = descriptors[route.key];
				const label =
					typeof options.tabBarLabel === "string"
						? options.tabBarLabel
						: (options.title ?? route.name);

				const isFocused = state.index === index;

				const onPress = () => {
					animatePress();

					const event = navigation.emit({
						type: "tabPress",
						target: route.key,
						canPreventDefault: true,
					});

					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(route.name, route.params);
					}
				};

				const onLongPress = () => {
					navigation.emit({
						type: "tabLongPress",
						target: route.key,
					});
				};

				const icon = options.tabBarIcon?.({
					focused: isFocused,
					color: isFocused ? "black" : "gray",
					size: 25,
				});
				return (
					<PlatformPressable
						key={route.key}
						href={buildHref(route.name, route.params)}
						accessibilityState={isFocused ? { selected: true } : {}}
						accessibilityLabel={options.tabBarAccessibilityLabel}
						testID={options.tabBarButtonTestID}
						onPress={onPress}
						onLongPress={onLongPress}
						android_ripple={{ color: "transparent" }}
						style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
					>
						<Animated.View
							style={{
								transform: [{ translateY: pressAnim }],
								alignItems: "center",
							}}
						>
							{icon}
						</Animated.View>
						<Text style={{ fontFamily: "Montserrat-Bold", fontSize: 10 }}>
							{label}
						</Text>
					</PlatformPressable>
				);
			})}
		</View>
	);
}

const Navigation = createStaticNavigation(Tab);

const AppContent = () => {
	const { isAuthenticated, isLoading } = useAuth();
	const { isLoading: isUserLoading } = useUser();

	const [topicId, setTopicId] = useState<null | string>(null);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#1A1A1A" }}>
			{isLoading || (isAuthenticated && isUserLoading) ? (
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: "white",
					}}
				>
					<ActivityIndicator size="large" color="#0091ffff" />
				</View>
			) : !isAuthenticated ? (
				<AuthScreen />
			) : (
				<TopicContext.Provider value={{ topicId, setTopicId }}>
					{topicId ? <Space topicId={topicId} /> : <Navigation />}
				</TopicContext.Provider>
			)}
		</SafeAreaView>
	);
};

const App = () => {
	return (
		<SafeAreaProvider>
			<AuthProvider>
				<UserProvider>
					<AppContent />
				</UserProvider>
			</AuthProvider>
		</SafeAreaProvider>
	);
};

export default App;
