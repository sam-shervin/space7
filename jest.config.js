module.exports = {
	preset: "react-native",
	transformIgnorePatterns: [
		"node_modules/(?!(@react-native|react-native|@react-navigation|react-native-safe-area-context|react-native-screens|react-native-gesture-handler|@react-native-vector-icons)/)",
	],
	moduleNameMapper: {
		"\\.(ttf)$": "<rootDir>/__mocks__/fileMock.js",
	},
};
