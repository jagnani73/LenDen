"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

interface UserContextType {
  user: { authToken: string; username: string } | null;
  setUser: React.Dispatch<
    React.SetStateAction<{ authToken: string; username: string } | null>
  >;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{
    authToken: string;
    username: string;
  } | null>(null);

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
