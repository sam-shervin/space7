/**
 * Tests for src/context/SpaceContext.ts (TopicContext / useTopic)
 */

import { act, renderHook } from "@testing-library/react-native";
import React, { useState } from "react";
import { TopicContext, useTopic } from "../../src/context/SpaceContext";

// A simple test provider that exposes state via TopicContext
const TestProvider = ({ children }: { children: React.ReactNode }) => {
	const [topicId, setTopicId] = useState<string | null>(null);

	return React.createElement(
		TopicContext.Provider,
		{ value: { topicId, setTopicId } },
		children,
	);
};

describe("useTopic", () => {
	it("throws when used outside TopicContext provider", () => {
		expect(() => renderHook(() => useTopic())).toThrow(
			"useTopic must be used inside TopicProvider",
		);
	});

	it("returns topicId as null initially", () => {
		const { result } = renderHook(() => useTopic(), {
			wrapper: TestProvider,
		});

		expect(result.current.topicId).toBeNull();
	});

	it("updates topicId via setTopicId", () => {
		const { result } = renderHook(() => useTopic(), {
			wrapper: TestProvider,
		});

		act(() => {
			result.current.setTopicId("space-123");
		});

		expect(result.current.topicId).toBe("space-123");
	});

	it("can reset topicId back to null", () => {
		const { result } = renderHook(() => useTopic(), {
			wrapper: TestProvider,
		});

		act(() => {
			result.current.setTopicId("space-123");
		});

		expect(result.current.topicId).toBe("space-123");

		act(() => {
			result.current.setTopicId(null);
		});

		expect(result.current.topicId).toBeNull();
	});
});
