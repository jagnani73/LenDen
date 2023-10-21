"use client";

import { TimestampParser } from "@/utils/functions";
import { completeLend, fetchLends } from "@/utils/services/api";
import { useUser } from "@/utils/store";
import { Lending } from "@/utils/types/services.types";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const LendingPage: React.FC = () => {
  const { user } = useUser();

  const [loading, setLoading] = useState<boolean>(false);
  const [lends, setLends] = useState<Lending[] | null>(null);

  useEffect(() => {
    if (user) {
      (async () => {
        const _lends = await fetchLends(user.username);
        if (_lends) {
          setLends(_lends);
        }
      })();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const completeLendHandler = useCallback(async (id: number) => {
    try {
      await completeLend(id);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <main className="flex flex-col gap-x-4 justify-center items-center w-full">
      <Link href="/lending/create">Create a new lending</Link>

      {!lends ? (
        <p>loading</p>
      ) : (
        <div className="flex gap-8 flex-wrap">
          {!lends.length ? (
            <p>no lends found</p>
          ) : (
            lends.map((lend) => (
              <article
                key={lend.id}
                className="mx-auto border rounded-md border-neutral-600 p-4 h-full"
              >
                <p>
                  Start Time: {TimestampParser(lend.created_at, "relative")}
                </p>
                <p>
                  Tenure: {lend.period} {lend.period_unit}
                </p>
                <p>
                  Input: {lend.amount} {lend.ticker}
                </p>
                <p>Interest : {lend.interest}%</p>
                <p>
                  Maturity: {lend.maturity} {lend.ticker}
                </p>
                <p>Status: {lend.status}</p>

                {Math.floor(
                  (new Date().getTime() - new Date(lend.created_at).getTime()) /
                    (1000 * 60 * 60 * 24 * 7)
                ) >= lend.period ? (
                  <button
                    type="button"
                    className="border bg-neutral-900 text-white rounded-md mt-4 px-4 py-4 w-full"
                    onClick={() => completeLendHandler(lend.id)}
                    disabled={loading}
                  >
                    {loading ? "loading..." : "Release maturity"}
                  </button>
                ) : null}
              </article>
            ))
          )}
        </div>
      )}
    </main>
  );
};
export default LendingPage;
