import type { ReactNode } from "react";
import {
	createContext,
	createElement,
	useContext,
	useEffect,
	useState,
} from "react";
import { getProfile, type Profile } from "../api/Profile";
import { useAuth } from "./AuthContext";

type UserContextValue = {
	user: Profile | null;
	isLoading: boolean;
	refreshUser: () => Promise<void>;
	clearUser: () => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const { isAuthenticated } = useAuth();
	const [user, setUser] = useState<Profile | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const clearUser = () => {
		setUser(null);
	};

	const refreshUser = async () => {
		try {
			setIsLoading(true);
			const profile = await getProfile();
			setUser(profile);
		} catch {
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (isAuthenticated) {
			const loadUser = async () => {
				try {
					setIsLoading(true);
					const profile = await getProfile();
					setUser(profile);
				} catch {
					setUser(null);
				} finally {
					setIsLoading(false);
				}
			};

			loadUser();
		} else {
			setUser(null);
			setIsLoading(false);
		}
	}, [isAuthenticated]);

	return createElement(
		UserContext.Provider,
		{
			value: {
				user,
				isLoading,
				refreshUser,
				clearUser,
			},
		},
		children,
	);
};

export const useUser = () => {
	const context = useContext(UserContext);

	if (!context) {
		throw new Error("useUser must be used inside UserProvider");
	}

	return context;
};