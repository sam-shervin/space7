const picker = {
	types: {
		audio: "audio/*",
	},
	errorCodes: {
		OPERATION_CANCELED: "OPERATION_CANCELED",
	},
	isErrorWithCode: jest.fn((error) =>
		Boolean(error && typeof error.code === "string"),
	),
	pick: jest.fn(async () => [
		{
			uri: "file:///mock-audio.mp3",
			name: "mock-audio.mp3",
			type: "audio/mpeg",
		},
	]),
};

module.exports = picker;
module.exports.default = picker;
