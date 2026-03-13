import { Image, View } from "react-native";

const logo = require("../../assets/images/logo.png");

import { useState } from "react";
// import { ForgotScreen } from "./ForgotScreen";
import { LoginScreen } from "./LoginScreen";
import { SignUpScreen } from "./SignUpScreen";

const AuthScreen = () => {
	const [screen, setScreen] = useState<"login" | "signup" | "forgot" | "reset">(
		"login",
	);
	return (
		<View
			style={{
				backgroundColor: "#FCD53D",
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<View
				style={{
					alignItems: "center",
					flex: 1,
					width: "100%",
					flexDirection: "column",
					justifyContent: "center",
				}}
			>
				<Image source={logo} style={{ width: 200, height: 200 }} />
				{screen === "login" && <LoginScreen setScreen={setScreen} />}
				{screen === "signup" && <SignUpScreen setScreen={setScreen} />}
				{/* {screen === "forgot" && <ForgotScreen setScreen={setScreen} />} */}
			</View>
		</View>
	);
};

export default AuthScreen;
