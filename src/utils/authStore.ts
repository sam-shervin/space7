import * as Keychain from "react-native-keychain";

export const saveToken = async (token: string) => {
	await Keychain.setGenericPassword("token", token, {
		accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
	});
};

export const getToken = async () => {
	const creds = await Keychain.getGenericPassword();
	if (!creds) return null;
	return creds.password;
};

export const clearToken = async () => {
	await Keychain.resetGenericPassword();
};
