"use client";

import { LOAN_TYPE, TICKER } from "@/utils/constants/services.constants";
import { repayLoan, fetchLoansForUsername } from "@/utils/services/api";
import { useUser } from "@/utils/store";
import { Loan } from "@/utils/types/services.types";
import { useCallback, useEffect, useState } from "react";
import { useConnect, useSendTransaction, useSwitchNetwork } from "wagmi";
import { parseEther } from "ethers";
import Link from "next/link";
import { TimestampParser } from "@/utils/functions";

const LoansPage: React.FC = () => {
  const { user } = useUser();

  const [loading, setLoading] = useState<boolean>(false);
  const { connect, connectors } = useConnect();
  const { switchNetwork } = useSwitchNetwork();
  const { isLoading, sendTransaction } = useSendTransaction();

  const [loans, setLoans] = useState<Loan[] | null>(null);

  useEffect(() => {
    if (user) {
      (async () => {
        const _loans = await fetchLoansForUsername(user.username);
        setLoans(_loans);
      })();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

  const repayLoanHandler = useCallback(
    async (id: string, output_ticker: TICKER, principal: number) => {
      try {
        setLoading(true);
        const output_chain = connectors[0].chains.find(
          (chain) => chain.nativeCurrency.symbol === output_ticker
        );
        switchNetwork?.(output_chain?.id);
        connect({
          connector: connectors[0],
          chainId: output_chain?.id,
        });
        sendTransaction({
          to: "0xeC2265da865A947647CE6175a4a2646318f6DCEb",
          value: parseEther(principal.toString()),
        });
        await repayLoan(id);
      } catch (error) {
        console.error(error);
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [connectors]
  );

  return (
    <main className="w-full">
      <Link href="/loans/borrow">Borrow a new loan</Link>

      {!loans ? (
        <p>loading</p>
      ) : (
        <div className="flex gap-8 flex-wrap">
          {!loans.length ? (
            <p>no loans found</p>
          ) : (
            loans.map((loan) => (
              <article
                key={loan.id}
                className="mx-auto border rounded-md border-neutral-600 p-4 h-full"
              >
                <p>Type: {loan.type}</p>
                <p>
                  Start Time: {TimestampParser(loan.start_time, "relative")}
                </p>
                <p>
                  Tenure: {loan.period} {loan.period_unit}
                </p>
                {loan.type !== LOAN_TYPE.NFT && (
                  <p>
                    Input: {loan.input_amount} {loan.input_ticker}
                  </p>
                )}
                <p>
                  Output Amount: {loan.output_amount} {loan.output_ticker}
                </p>
                <p>Interest : {loan.interest}%</p>
                <p>
                  To Pay: {loan.principal} {loan.output_ticker}
                </p>
                <p>Status: {loan.status}</p>
                <p>Warning Number: {loan.warning_intensity}</p>

                {loan.status === "accepted" && (
                  <button
                    type="button"
                    className="border bg-neutral-900 text-white rounded-md mt-4 px-4 py-4 w-full"
                    onClick={() =>
                      repayLoanHandler(
                        loan.id,
                        loan.output_ticker,
                        loan.principal
                      )
                    }
                    disabled={loading}
                  >
                    {loading ? "loading..." : "Repay Loan"}
                  </button>
                )}
              </article>
            ))
          )}
        </div>
      )}
    </main>
  );
};

export default LoansPage;
