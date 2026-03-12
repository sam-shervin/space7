/**
 * Tests for the pure helper functions in Home.tsx and MyProfile.tsx
 * (mapSpaceToTopicItem) and the hashtag-parsing logic in NewTopic.tsx
 */

import type { Space } from "../../src/api/Spaces";
import type { TopicItem } from "../../src/types/types";

// ─── mapSpaceToTopicItem (inlined here to test the pure logic) ────────────────
// This function is defined identically in both Home.tsx and MyProfile.tsx.
// We test the logic directly without importing the React component.

const mapSpaceToTopicItem = (space: Space): TopicItem => ({
	id: space.space_id,
	topic: space.title,
	description: space.description,
	author: space.creator.username,
	count: space.participant_count,
	tags: space.tags.map((tag) => tag.tag_name),
});

const sampleSpace: Space = {
	space_id: "space-1",
	title: "AI in 2026",
	description: "Discussing the impact of AI",
	visibility: "public",
	creator: { user_id: "user-1", username: "alice", profile_picture: "" },
	participant_count: 42,
	tags: [
		{ tag_id: 1, tag_name: "ai" },
		{ tag_id: 2, tag_name: "tech" },
	],
};

describe("mapSpaceToTopicItem", () => {
	it("maps space_id to id", () => {
		expect(mapSpaceToTopicItem(sampleSpace).id).toBe("space-1");
	});

	it("maps title to topic", () => {
		expect(mapSpaceToTopicItem(sampleSpace).topic).toBe("AI in 2026");
	});

	it("maps description", () => {
		expect(mapSpaceToTopicItem(sampleSpace).description).toBe(
			"Discussing the impact of AI",
		);
	});

	it("maps creator username to author", () => {
		expect(mapSpaceToTopicItem(sampleSpace).author).toBe("alice");
	});

	it("maps participant_count to count", () => {
		expect(mapSpaceToTopicItem(sampleSpace).count).toBe(42);
	});

	it("maps tag_name array to tags", () => {
		expect(mapSpaceToTopicItem(sampleSpace).tags).toEqual(["ai", "tech"]);
	});

	it("produces an empty tags array when space has no tags", () => {
		const spaceNoTags = { ...sampleSpace, tags: [] };
		expect(mapSpaceToTopicItem(spaceNoTags).tags).toEqual([]);
	});
});

// ─── hashtag parsing logic (from NewTopic.tsx) ────────────────────────────────
// The component derives hashtags via:
//   hashtagsInput.split(",").map(tag => tag.replace(/#/g, "").trim()).filter(Boolean)

const parseHashtags = (input: string): string[] =>
	input
		.split(",")
		.map((tag) => tag.replace(/#/g, "").trim())
		.filter(Boolean);

describe("parseHashtags (NewTopic hashtag logic)", () => {
	it("splits comma-separated tags", () => {
		expect(parseHashtags("ai, tech, react")).toEqual(["ai", "tech", "react"]);
	});

	it("strips leading # characters", () => {
		expect(parseHashtags("#ai, #tech")).toEqual(["ai", "tech"]);
	});

	it("strips multiple # characters", () => {
		expect(parseHashtags("##ai")).toEqual(["ai"]);
	});

	it("trims surrounding whitespace", () => {
		expect(parseHashtags("  ai  ,  tech  ")).toEqual(["ai", "tech"]);
	});

	it("filters out empty entries", () => {
		expect(parseHashtags("ai,,tech,")).toEqual(["ai", "tech"]);
	});

	it("returns empty array for empty input", () => {
		expect(parseHashtags("")).toEqual([]);
	});

	it("returns empty array for whitespace-only input", () => {
		expect(parseHashtags("   ")).toEqual([]);
	});

	it("handles a single tag with no comma", () => {
		expect(parseHashtags("javascript")).toEqual(["javascript"]);
	});
});
