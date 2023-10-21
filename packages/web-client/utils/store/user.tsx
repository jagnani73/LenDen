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
  } | null>({
    authToken: "a",
    username: "karanpargal007",
    wallet_addresses: {
      AVAX: {
        signature:
          "0xed7c85e67786b3e3565e7ae214f083f26e758e0eaa1340c9c52f13740cb75e3f77f6ef659e9b09a68751efdf4ea49915a5bd7c82f5d45fc89b4304c702f723a31c",
        wallet_address: "0xC2e7D52caEecC220AF3f48785ebdF8b331a7B668",
      },
      MATIC: {
        signature:
          "0xed7c85e67786b3e3565e7ae214f083f26e758e0eaa1340c9c52f13740cb75e3f77f6ef659e9b09a68751efdf4ea49915a5bd7c82f5d45fc89b4304c702f723a31c",
        wallet_address: "0xC2e7D52caEecC220AF3f48785ebdF8b331a7B668",
      },
    },
  });

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
