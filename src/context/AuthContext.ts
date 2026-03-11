import type { ReactNode } from "react";
import {
	createContext,
	createElement,
	useContext,
	useEffect,
	useState,
} from "react";
import { clearToken, getToken, saveToken } from "../utils/authStore";

type AuthContextValue = {
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (token: string) => Promise<void>;
	logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

let logoutFromAnywhere: (() => Promise<void>) | null = null;

export const notifyUnauthorizedLogout = async () => {
	if (logoutFromAnywhere) {
		await logoutFromAnywhere();
	}
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const login = async (token: string) => {
		await saveToken(token);
		setIsAuthenticated(true);
	};

	const logout = async () => {
		await clearToken();
		setIsAuthenticated(false);
	};

	useEffect(() => {
		const restoreSession = async () => {
			const token = await getToken();
			setIsAuthenticated(Boolean(token));
			setIsLoading(false);
		};

		restoreSession();
	}, []);

	useEffect(() => {
		logoutFromAnywhere = logout;

		return () => {
			logoutFromAnywhere = null;
		};
	});

	return createElement(
		AuthContext.Provider,
		{
			value: {
				isAuthenticated,
				isLoading,
				login,
				logout,
			},
		},
		children,
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}

	return context;
};
