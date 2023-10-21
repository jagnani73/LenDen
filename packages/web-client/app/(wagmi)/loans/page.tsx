"use client";

import { LOAN_TYPE, TICKER } from "@/utils/constants/services.constants";
import { repayLoan, fetchLoansForUsername } from "@/utils/services/api";
import { useUser } from "@/utils/store";
import { Loan } from "@/utils/types/services.types";
import { useCallback, useEffect, useState } from "react";
import { useConnect, useSendTransaction, useSwitchNetwork } from "wagmi";
import { parseEther } from "ethers";
import Link from "next/link";
import { PrettyNumber, TimestampParser } from "@/utils/functions";
import Image from "next/image";
import { Pixelify_Sans } from "next/font/google";

const pixelifySanse = Pixelify_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

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
    <main className="flex-1 w-full h-full p-10">
      <h2 className={`text-6xl ${pixelifySanse.className}`}>
        Your active loans
      </h2>

      {!loans ? (
        <figure className="flex items-center justify-center w-full h-full mt-32">
          <Image height={160} width={160} alt="loader" src="/loader.gif" />
        </figure>
      ) : (
        <div className="grid grid-cols-4 gap-20 mt-20">
          {!loans.length ? (
            <p className="text-4xl m-auto">No loans found!</p>
          ) : (
            loans.map((loan) => (
              <article
                key={loan.id}
                className={`mx-auto border-2 bg-ghost-white p-4 w-full h-full flex flex-col justify-between ${
                  loan.warning_intensity === 0
                    ? "border-green-yellow"
                    : loan.warning_intensity === 1
                    ? "border-red-500"
                    : loan.warning_intensity === 2
                    ? "border-red-700"
                    : "border-red-900"
                }`}
              >
                <div>
                  <p className="uppercase font-bold text-xl mb-2">
                    {loan.type}
                  </p>
                  <p>
                    Start Time: {TimestampParser(loan.start_time, "relative")}
                  </p>
                  <p>
                    Tenure: {loan.period} {loan.period_unit}
                  </p>
                  {loan.type !== LOAN_TYPE.NFT && (
                    <p>
                      Input:{" "}
                      <span className="font-bold">
                        {PrettyNumber(loan.input_amount as number)}{" "}
                        {loan.input_ticker}
                      </span>
                    </p>
                  )}
                  <p>
                    Output Amount:{" "}
                    <span className="font-bold">
                      {PrettyNumber(loan.output_amount)} {loan.output_ticker}
                    </span>
                  </p>
                  <p>
                    Interest :{" "}
                    <span className="font-bold">{loan.interest}%</span>
                  </p>
                  <p>
                    To Pay:{" "}
                    <span className="font-bold">
                      {PrettyNumber(loan.principal)} {loan.output_ticker}
                    </span>
                  </p>
                  <p>Status: {loan.status}</p>
                  <p>Warning Level: {loan.warning_intensity}</p>
                </div>

                {loan.status === "accepted" ? (
                  <button
                    type="button"
                    className="bg-green-yellow text-black text-xl mt-4 font-medium px-4 py-4 w-full"
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
                ) : (
                  loan.status === "bidding" && (
                    <Link
                      href={`/loans/bids/${loan.id}`}
                      className="bg-green-yellow block text-center mt-4 text-black text-xl font-medium px-4 py-4 w-full"
                    >
                      View bids
                    </Link>
                  )
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
