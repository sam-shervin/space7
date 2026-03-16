const React = require("react");
const { View } = require("react-native");

function Video() {
	return React.createElement(View, { testID: "mock-video" });
}

module.exports = Video;
module.exports.default = Video;
