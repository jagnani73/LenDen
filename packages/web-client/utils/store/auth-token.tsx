"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

interface AuthTokenContextType {
  authToken: string | null;
  setAuthToken: React.Dispatch<React.SetStateAction<string | null>>;
}

interface AuthTokenProviderProps {
  children: ReactNode;
}

const AuthTokenContext = createContext<AuthTokenContextType>(
  {} as AuthTokenContextType
);

export const AuthTokenProvider: React.FC<AuthTokenProviderProps> = ({
  children,
}) => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  return (
    <AuthTokenContext.Provider
      value={{
        authToken: authToken,
        setAuthToken: setAuthToken,
      }}
    >
      {children}
    </AuthTokenContext.Provider>
  );
};

export const useAuthToken = () => useContext(AuthTokenContext);
