/**
 * Tests for src/context/AuthContext.ts
 */

import React from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import {
	AuthProvider,
	useAuth,
	notifyUnauthorizedLogout,
} from "../../src/context/AuthContext";

jest.mock("../../src/utils/authStore", () => ({
	saveToken: jest.fn(),
	getToken: jest.fn(),
	clearToken: jest.fn(),
}));

import { saveToken, getToken, clearToken } from "../../src/utils/authStore";

const mockSaveToken = saveToken as jest.MockedFunction<typeof saveToken>;
const mockGetToken = getToken as jest.MockedFunction<typeof getToken>;
const mockClearToken = clearToken as jest.MockedFunction<typeof clearToken>;

const flushPromises = () => new Promise<void>((r) => setImmediate(r));

const wrapper = ({ children }: { children: React.ReactNode }) =>
	React.createElement(AuthProvider, null, children);

beforeEach(() => {
	jest.clearAllMocks();
});

describe("AuthProvider – session restoration", () => {
	it("starts as authenticated when a token is stored", async () => {
		mockGetToken.mockResolvedValueOnce("stored-token");

		const { result } = renderHook(() => useAuth(), { wrapper });

		expect(result.current.isLoading).toBe(true);

		await act(async () => {
			await flushPromises();
		});

		expect(result.current.isAuthenticated).toBe(true);
		expect(result.current.isLoading).toBe(false);
	});

	it("starts as unauthenticated when no token is stored", async () => {
		mockGetToken.mockResolvedValueOnce(null);

		const { result } = renderHook(() => useAuth(), { wrapper });

		await act(async () => {
			await flushPromises();
		});

		expect(result.current.isAuthenticated).toBe(false);
		expect(result.current.isLoading).toBe(false);
	});
});

describe("AuthProvider – login", () => {
	it("saves the token and sets isAuthenticated to true", async () => {
		mockGetToken.mockResolvedValueOnce(null);
		mockSaveToken.mockResolvedValueOnce(undefined);

		const { result } = renderHook(() => useAuth(), { wrapper });

		await act(async () => {
			await flushPromises();
		});

		await act(async () => {
			await result.current.login("new-jwt-token");
		});

		expect(mockSaveToken).toHaveBeenCalledWith("new-jwt-token");
		expect(result.current.isAuthenticated).toBe(true);
	});
});

describe("AuthProvider – logout", () => {
	it("clears the token and sets isAuthenticated to false", async () => {
		mockGetToken.mockResolvedValueOnce("stored-token");
		mockClearToken.mockResolvedValueOnce(undefined);

		const { result } = renderHook(() => useAuth(), { wrapper });

		await act(async () => {
			await flushPromises();
		});

		expect(result.current.isAuthenticated).toBe(true);

		await act(async () => {
			await result.current.logout();
		});

		expect(mockClearToken).toHaveBeenCalledTimes(1);
		expect(result.current.isAuthenticated).toBe(false);
	});
});

describe("notifyUnauthorizedLogout", () => {
	it("does nothing when called outside a provider context", async () => {
		await expect(notifyUnauthorizedLogout()).resolves.toBeUndefined();
	});

	it("triggers logout when called while provider is mounted", async () => {
		mockGetToken.mockResolvedValueOnce("stored-token");
		mockClearToken.mockResolvedValueOnce(undefined);

		const { result } = renderHook(() => useAuth(), { wrapper });

		await act(async () => {
			await flushPromises();
		});

		expect(result.current.isAuthenticated).toBe(true);

		await act(async () => {
			await notifyUnauthorizedLogout();
		});

		expect(result.current.isAuthenticated).toBe(false);
	});
});

describe("useAuth", () => {
	it("throws when used outside AuthProvider", () => {
		const { result } = renderHook(() => useAuth());
		expect(result.error?.message).toBe(
			"useAuth must be used within AuthProvider",
		);
	});
});
