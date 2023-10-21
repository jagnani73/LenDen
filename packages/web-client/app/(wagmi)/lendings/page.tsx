"use client";

import { PrettyNumber, TimestampParser } from "@/utils/functions";
import { completeLend, fetchLends } from "@/utils/services/api";
import { useUser } from "@/utils/store";
import { Lending } from "@/utils/types/services.types";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Pixelify_Sans } from "next/font/google";

const pixelifySanse = Pixelify_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

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
    <main className="flex-1 w-full h-full p-10">
      <h2 className={`text-6xl ${pixelifySanse.className}`}>
        Your active lendings
      </h2>

      {!lends ? (
        <figure className="flex items-center justify-center w-full h-full mt-32">
          <Image height={160} width={160} alt="loader" src="/loader.gif" />
        </figure>
      ) : (
        <div className="grid grid-cols-4 gap-20 mt-20">
          {!lends.length ? (
            <p className="text-4xl m-auto">No lendings found!</p>
          ) : (
            lends.map((lend) => (
              <article
                key={lend.id}
                className={`mx-auto border-2 bg-ghost-white p-4 w-full h-full flex flex-col justify-between border-green-yellow`}
              >
                <div>
                  <p>
                    Start Time: {TimestampParser(lend.created_at, "relative")}
                  </p>
                  <p>
                    Tenure: {lend.period} {lend.period_unit}
                  </p>
                  <p>
                    Input:{" "}
                    <span className="font-bold">
                      {PrettyNumber(lend.amount)} {lend.ticker}
                    </span>
                  </p>
                  <p>Interest : {lend.interest}%</p>
                  <p>
                    Maturity:{" "}
                    <span className="font-bold">
                      {PrettyNumber(lend.maturity)} {lend.ticker}
                    </span>
                  </p>
                  <p>Status: {lend.status}</p>
                </div>

                {Math.floor(
                  (new Date().getTime() - new Date(lend.created_at).getTime()) /
                    (1000 * 60 * 60 * 24 * 7)
                ) >= lend.period ? (
                  <button
                    type="button"
                    className="bg-green-yellow text-black text-xl mt-4 font-medium px-4 py-4 w-full"
                    onClick={() => completeLendHandler(lend.id)}
                    disabled={loading}
                  >
                    {loading ? "loading..." : "Release maturity"}
                  </button>
                ) : (
                  <></>
                )}
              </article>
            ))
          )}
        </div>
      )}
    </main>
  );
};
export default LendingPage;
