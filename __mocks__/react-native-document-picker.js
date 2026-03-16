const documentPicker = {
	types: {
		audio: "audio/*",
	},
	pickSingle: jest.fn(async () => {
		throw new Error("Document picker mock not configured");
	}),
	isCancel: jest.fn(() => false),
};

module.exports = documentPicker;
module.exports.default = documentPicker;
