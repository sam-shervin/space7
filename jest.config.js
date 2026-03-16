module.exports = {
	preset: "react-native",
	transformIgnorePatterns: [
		"node_modules/(?!(@react-native|react-native|@react-navigation|react-native-safe-area-context|react-native-screens|react-native-gesture-handler|@react-native-vector-icons)/)",
	],
	moduleNameMapper: {
		"^@env$": "<rootDir>/__mocks__/@env.js",
		"^react-native-image-picker$":
			"<rootDir>/__mocks__/react-native-image-picker.js",
		"^react-native-video$": "<rootDir>/__mocks__/react-native-video.js",
		"^@react-native-documents/picker$":
			"<rootDir>/__mocks__/@react-native-documents-picker.js",
		"\\.(ttf)$": "<rootDir>/__mocks__/fileMock.js",
	},
};
