import { TICKER } from "../constants/services.constants";
import { Evaluation, Loan } from "../types/services.types";

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
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchLoansForUsername = async (username: string) => {
  try {
    const response = await fetch(`${baseUrl}/loans/${username}`, {
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
    const response = await fetch(`${baseUrl}/loans/evaluate`, {
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
    await fetch(`${baseUrl}/loans/accept`, {
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
    await fetch(`${baseUrl}/loans/repayment`, {
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
  period: number
) => {
  try {
    await fetch(`${baseUrl}/lending/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wallet_address: wallet_address,
        ticker: ticker,
        amount: amount,
        period: period,
      }),
    });
    return;
  } catch (error) {
    console.error(error);
    return;
  }
};
