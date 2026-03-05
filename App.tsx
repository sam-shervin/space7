import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Home from "./src/screens/home/Home";

const App = () => {
	return (
		<SafeAreaProvider>
			<SafeAreaView style={{ flex: 1 }}>
				<Home />
			</SafeAreaView>
		</SafeAreaProvider>
	);
};

export default App;
