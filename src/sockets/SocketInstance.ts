import { io, type Socket } from "socket.io-client";
import { API } from "../constants/Network";
import { getToken } from "../utils/authStore";

export type SendMessagePayload = {
	spaceId: string;
	message: Record<string, unknown>;
};

export type MessageAppreciatedPayload = {
	spaceId: string;
	messageId: string;
	appreciated: boolean;
	userId: string;
};

type ReceiveMessagePayload = Record<string, unknown>;

type SocketEvents = {
	receive_message: (payload: ReceiveMessagePayload) => void;
	message_appreciated: (payload: MessageAppreciatedPayload) => void;
	connect: () => void;
	disconnect: (reason: string) => void;
	connect_error: (error: Error) => void;
};

const socket: Socket = io(API, {
	autoConnect: false,
	transports: ["websocket"],
});

const connectSocket = async () => {
	const token = await getToken();

	if (!token) {
		throw new Error("Authentication token not found");
	}

	socket.auth = { token };

	if (!socket.connected) {
		socket.connect();
	}

	return socket;
};

const disconnectSocket = () => {
	if (socket.connected) {
		socket.disconnect();
	}
};

const joinSpace = (spaceId: string) => {
	socket.emit("join_space", spaceId);
};

const leaveSpace = (spaceId: string) => {
	socket.emit("leave_space", spaceId);
};

const sendMessage = (payload: SendMessagePayload) => {
	socket.emit("send_message", payload);
};

const setMessageAppreciated = (payload: MessageAppreciatedPayload) => {
	socket.emit("message_appreciated", payload);
};

const onReceiveMessage = (handler: SocketEvents["receive_message"]) => {
	socket.on("receive_message", handler);
	return () => socket.off("receive_message", handler);
};

const onMessageAppreciated = (handler: SocketEvents["message_appreciated"]) => {
	socket.on("message_appreciated", handler);
	return () => socket.off("message_appreciated", handler);
};

export {
	connectSocket,
	disconnectSocket,
	joinSpace,
	leaveSpace,
	sendMessage,
	setMessageAppreciated,
	onReceiveMessage,
	onMessageAppreciated,
	socket,
};

export default socket;
