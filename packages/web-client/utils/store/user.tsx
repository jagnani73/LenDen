"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { usePathname } from "next/navigation";

interface UserContextType {
  user: {
    authToken: string;
    username: string;
    wallet_addresses: {
      [ticker: string]: {
        wallet_address: string;
        signature: string;
      };
    };
  } | null;
  setUser: React.Dispatch<
    React.SetStateAction<{
      authToken: string;
      username: string;
      wallet_addresses: {
        [ticker: string]: {
          wallet_address: string;
          signature: string;
        };
      };
    } | null>
  >;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { replace } = useRouter();
  const path = usePathname();

  const [user, setUser] = useState<{
    authToken: string;
    username: string;
    wallet_addresses: {
      [ticker: string]: {
        wallet_address: string;
        signature: string;
      };
    };
  } | null>(null);

  useEffect(() => {
    if (!user && path !== "sign-in") {
      replace("/sign-up");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user: user,
        setUser: setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
