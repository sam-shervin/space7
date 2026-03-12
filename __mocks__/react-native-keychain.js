const ACCESSIBLE = {
	AFTER_FIRST_UNLOCK: "AfterFirstUnlock",
	AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: "AfterFirstUnlockThisDeviceOnly",
	ALWAYS: "Always",
	ALWAYS_THIS_DEVICE_ONLY: "AlwaysThisDeviceOnly",
	WHEN_PASSCODE_SET_THIS_DEVICE_ONLY: "WhenPasscodeSetThisDeviceOnly",
	WHEN_UNLOCKED: "WhenUnlocked",
	WHEN_UNLOCKED_THIS_DEVICE_ONLY: "WhenUnlockedThisDeviceOnly",
};

const STORAGE_TYPE = {
	AES_CBC: "KeystoreAESCBC",
	AES_GCM: "KeystoreAESGCM",
	AES_GCM_NO_AUTH: "KeystoreAESGCM_NoAuth",
	FB: "FacebookConceal",
	KC: "keychain",
	RSA: "KeystoreRSAECB",
};

module.exports = {
	setGenericPassword: jest.fn().mockResolvedValue(true),
	getGenericPassword: jest.fn().mockResolvedValue(false),
	resetGenericPassword: jest.fn().mockResolvedValue(true),
	setInternetCredentials: jest.fn().mockResolvedValue(true),
	getInternetCredentials: jest.fn().mockResolvedValue(false),
	resetInternetCredentials: jest.fn().mockResolvedValue(true),
	ACCESSIBLE,
	STORAGE_TYPE,
};
