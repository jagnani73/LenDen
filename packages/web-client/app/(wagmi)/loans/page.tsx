"use client";

import { LOAN_TYPE } from "@/utils/constants/services.constants";
import { fetchLoansForUsername } from "@/utils/services/api";
import { useUser } from "@/utils/store";
import { Loan } from "@/utils/types/services.types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LoansPage: React.FC = () => {
  const { user } = useUser();

  const { replace } = useRouter();

  const [loans, setLoans] = useState<Loan[] | null>(null);

  useEffect(() => {
    if (!user) {
      replace("/sign-in");
    } else {
      (async () => {
        const _loans = await fetchLoansForUsername(user.username);
        setLoans(_loans);
      })();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <main>
      {!loans ? (
        <p>loading</p>
      ) : (
        <div className="flex gap-8 flex-wrap">
          {loans.map((loan) => (
            <article
              key={loan.id}
              className="mx-auto border rounded-md border-neutral-600 p-4 h-full"
            >
              <p>Type: {loan.type}</p>
              <p>Start Time: {loan.start_time}</p>
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
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default LoansPage;
