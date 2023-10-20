const baseUrl: string = "http://localhost:8080/api/v1";

export const usersSignUp = async (
  username: string,
  password: string,
  wallet_addresses: {
    [ticker: string]: {
      wallet_address: string;
      signature: string;
    };
  }
) => {
  try {
    await fetch(`${baseUrl}/users/sign-up`, {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
        wallet_addresses: wallet_addresses,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export const usersSignIn = async (username: string, password: string) => {
  try {
    const response = await fetch(`${baseUrl}/users/sign-in`, {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data.token as string;
  } catch (error) {
    console.error(error);
    return null;
  }
};
