/**
 * Tests for src/context/UserContext.ts
 */

import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";
import { AuthProvider } from "../../src/context/AuthContext";
import { UserProvider, useUser } from "../../src/context/UserContext";

jest.mock("../../src/utils/authStore", () => ({
	saveToken: jest.fn(),
	getToken: jest.fn(),
	clearToken: jest.fn(),
}));

jest.mock("../../src/api/Profile", () => ({
	getProfile: jest.fn(),
}));

import { getProfile } from "../../src/api/Profile";
import { getToken } from "../../src/utils/authStore";

const mockGetToken = getToken as jest.MockedFunction<typeof getToken>;
const mockGetProfile = getProfile as jest.MockedFunction<typeof getProfile>;

const flushPromises = () => new Promise<void>((r) => setImmediate(r));

const sampleProfile = {
	user_id: "uuid-1",
	username: "alice",
	email: "alice@example.com",
	bio: "Hello",
	profile_picture: "",
	is_verified: true,
	created_at: "2026-03-10T00:00:00Z",
	updated_at: "2026-03-10T00:00:00Z",
	stats: {
		spaces_created: 1,
		spaces_participated: 2,
		total_words_contributed: 50,
		total_appreciations_received: 5,
	},
};

// Wrap with both AuthProvider and UserProvider
const wrapper = ({ children }: { children: React.ReactNode }) =>
	React.createElement(
		AuthProvider,
		null,
		React.createElement(UserProvider, null, children),
	);

beforeEach(() => {
	jest.clearAllMocks();
});

describe("UserProvider – when authenticated", () => {
	it("loads the user profile when authenticated", async () => {
		mockGetToken.mockResolvedValue("stored-token");
		mockGetProfile.mockResolvedValue(sampleProfile);

		const { result } = renderHook(() => useUser(), { wrapper });

		await act(async () => {
			await flushPromises();
		});

		expect(result.current.user).toEqual(sampleProfile);
		expect(result.current.isLoading).toBe(false);
	});

	it("sets user to null when getProfile throws", async () => {
		mockGetToken.mockResolvedValue("stored-token");
		mockGetProfile.mockRejectedValue(new Error("Network error"));

		const { result } = renderHook(() => useUser(), { wrapper });

		await act(async () => {
			await flushPromises();
		});

		expect(result.current.user).toBeNull();
		expect(result.current.isLoading).toBe(false);
	});
});

describe("UserProvider – when not authenticated", () => {
	it("does not load user and keeps null", async () => {
		mockGetToken.mockResolvedValue(null);

		const { result } = renderHook(() => useUser(), { wrapper });

		await act(async () => {
			await flushPromises();
		});

		expect(result.current.user).toBeNull();
		expect(result.current.isLoading).toBe(false);
	});
});

describe("UserProvider – refreshUser", () => {
	it("refreshes the user profile", async () => {
		mockGetToken.mockResolvedValue("stored-token");
		mockGetProfile.mockResolvedValue(sampleProfile);

		const { result } = renderHook(() => useUser(), { wrapper });

		await act(async () => {
			await flushPromises();
		});

		const updatedProfile = { ...sampleProfile, username: "alice-updated" };
		mockGetProfile.mockResolvedValueOnce(updatedProfile);

		await act(async () => {
			await result.current.refreshUser();
		});

		expect(result.current.user?.username).toBe("alice-updated");
	});

	it("sets user to null when refresh fails", async () => {
		mockGetToken.mockResolvedValue("stored-token");
		mockGetProfile.mockResolvedValue(sampleProfile);

		const { result } = renderHook(() => useUser(), { wrapper });

		await act(async () => {
			await flushPromises();
		});

		mockGetProfile.mockRejectedValueOnce(new Error("Network error"));

		await act(async () => {
			await result.current.refreshUser();
		});

		expect(result.current.user).toBeNull();
	});
});

describe("UserProvider – clearUser", () => {
	it("sets user to null when clearUser is called", async () => {
		mockGetToken.mockResolvedValue("stored-token");
		mockGetProfile.mockResolvedValue(sampleProfile);

		const { result } = renderHook(() => useUser(), { wrapper });

		await act(async () => {
			await flushPromises();
		});

		expect(result.current.user).toEqual(sampleProfile);

		act(() => {
			result.current.clearUser();
		});

		expect(result.current.user).toBeNull();
	});
});

describe("useUser", () => {
	it("throws when used outside UserProvider", () => {
		const { result } = renderHook(() => useUser());
		expect(result.error?.message).toBe(
			"useUser must be used inside UserProvider",
		);
	});
});
