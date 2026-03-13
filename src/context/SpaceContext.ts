import { createContext, useContext } from "react";

type TopicContextType = {
	topicId: string | null;
	setTopicId: (value: string | null) => void;
};

export const TopicContext = createContext<TopicContextType | null>(null);

export const useTopic = () => {
	const ctx = useContext(TopicContext);
	if (!ctx) throw new Error("useTopic must be used inside TopicProvider");
	return ctx;
};
