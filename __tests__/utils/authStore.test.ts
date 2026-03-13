/**
 * Tests for src/utils/authStore.ts
 */

import { clearToken, getToken, saveToken } from "../../src/utils/authStore";

jest.mock("react-native-keychain");

import * as Keychain from "react-native-keychain";

const mockKeychain = Keychain as jest.Mocked<typeof Keychain>;

beforeEach(() => {
	jest.clearAllMocks();
});

describe("saveToken", () => {
	it("calls setGenericPassword with the token", async () => {
		await saveToken("my-jwt-token");

		expect(mockKeychain.setGenericPassword).toHaveBeenCalledWith(
			"token",
			"my-jwt-token",
			{ accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK },
		);
	});
});

describe("getToken", () => {
	it("returns the stored token when credentials exist", async () => {
		mockKeychain.getGenericPassword.mockResolvedValueOnce({
			service: "app",
			storage: "keychain" as Keychain.STORAGE_TYPE,
			username: "token",
			password: "my-jwt-token",
		});

		const token = await getToken();

		expect(token).toBe("my-jwt-token");
	});

	it("returns null when no credentials are stored", async () => {
		mockKeychain.getGenericPassword.mockResolvedValueOnce(false);

		const token = await getToken();

		expect(token).toBeNull();
	});
});

describe("clearToken", () => {
	it("calls resetGenericPassword", async () => {
		await clearToken();

		expect(mockKeychain.resetGenericPassword).toHaveBeenCalledTimes(1);
	});
});
