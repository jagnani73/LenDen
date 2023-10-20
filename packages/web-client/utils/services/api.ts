import { TICKER } from "../constants/services.constants";
import { Evaluation, Lending, Loan } from "../types/services.types";

const baseURL: string = "http://localhost:8080/api/v1";

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
    await fetch(`${baseURL}/users/sign-up`, {
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
    const response = await fetch(`${baseURL}/users/sign-in`, {
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
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchLoansForUsername = async (username: string) => {
  try {
    const response = await fetch(`${baseURL}/loans/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data.loans as Loan[];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const evaluateLoan = async (loan: any) => {
  try {
    const response = await fetch(`${baseURL}/loans/evaluate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loan),
    });
    const { evaluation } = await response.json();
    return evaluation as Evaluation;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const acceptLoan = async (id: string) => {
  try {
    await fetch(`${baseURL}/loans/accept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    });
    return;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const repayLoan = async (id: string) => {
  try {
    await fetch(`${baseURL}/loans/repayment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    });
    return;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const createLending = async (
  wallet_address: string,
  ticker: TICKER,
  amount: number,
  period: number,
  username: string
) => {
  try {
    await fetch(`${baseURL}/lending/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wallet_address: wallet_address,
        ticker: ticker,
        amount: amount,
        period: period,
        username: username,
      }),
    });
    return;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const fetchLends = async (username: string) => {
  try {
    const response = await fetch(`${baseURL}/lending/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data.lends as Lending[];
  } catch (error) {
    console.error(error);
    return;
  }
};

export const completeLend = async (id: number) => {
  try {
    const response = await fetch(`${baseURL}/lending/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    });
    const hash = await response.json();
    return hash as string;
  } catch (error) {
    console.error(error);
    return;
  }
};
