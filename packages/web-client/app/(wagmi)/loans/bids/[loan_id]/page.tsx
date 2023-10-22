"use client";

import { CustomField } from "@/components/shared";
import { CreateYupSchema, TimestampParser, Truncate } from "@/utils/functions";
import { addBid, fetchBidItem, fetchBids } from "@/utils/services/api";
import { useUser } from "@/utils/store";
import { Bid, Loan } from "@/utils/types/services.types";
import { CustomFieldTypes, FieldClassnames } from "@/utils/types/shared.types";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { Pixelify_Sans } from "next/font/google";
import Image from "next/image";

const pixelifySanse = Pixelify_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});
const LoadIDPage: React.FC<{ params: { loan_id: string } }> = ({
  params: { loan_id },
}) => {
  const { user } = useUser();

  const [loading, setLoading] = useState<boolean>(false);
  const [item, setItem] = useState<Loan | null>(null);
  const [bids, setBids] = useState<Bid[] | null>(null);
  const [nft, setNft] = useState<string | null>(null);
  const [nftError, setNFTError] = useState<boolean>(false);

  useEffect(() => {
    if (user && loan_id) {
      (async () => {
        const [_bids, _itemData] = await Promise.all([
          fetchBids(loan_id),
          fetchBidItem(loan_id),
        ]);
        if (_itemData) {
          setItem(_itemData.item);
          setNft(_itemData.nft);
        }
        if (_bids) {
          setBids(_bids);
        }
      })();
    }
  }, [loan_id, user]);

  const CLASSNAMES = useMemo<FieldClassnames>(
    () => ({
      wrapper: "w-full bg-transparent",
      input:
        "border-b border-green-yellow text-xl bg-transparent px-1 py-2 w-full outline-none",
      description: "text-red-700 text-xs font-medium my-0.5 pl-1",
    }),
    []
  );
  const FIELDS = useMemo<CustomFieldTypes[]>(
    () => [
      {
        id: "amount",
        name: "amount",
        type: "number",
        placeholder: "Enter the Bid Amount",
        validationtype: "number",
        validations: [
          {
            type: "required",
            params: ["this field is mandatory"],
          },
        ],
        classnames: CLASSNAMES,
      },
    ],
    [CLASSNAMES]
  );

  const submitHandler = useCallback(
    async (values: any) => {
      try {
        setLoading(true);
        const wallet_address =
          user!.wallet_addresses[item!.input_ticker].wallet_address;
        await addBid(loan_id, values.amount, wallet_address);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },

    [item, loan_id, user]
  );

  return (
    <main className="flex-1 w-full h-full p-10">
      <h2 className={`text-6xl ${pixelifySanse.className}`}>
        Currents bids made
      </h2>

      {!bids || !item ? (
        <figure className="flex items-center justify-center w-full h-full mt-32">
          <Image height={160} width={160} alt="loader" src="/loader.gif" />
        </figure>
      ) : (
        <div className="w-full flex items-start gap-16 mt-20">
          {nft && (
            <figure className="flex w-1/3 bg-ghost-white border-2 border-green-yellow p-4">
              <img
                alt="nft"
                onError={() => setNFTError(true)}
                src={nftError ? "/no-nft.svg" : nft}
                className="object-contain flex"
              />
            </figure>
          )}

          <div className="w-2/3 grid grid-cols-1 gap-y-4">
            {item && item.status === "bidding" && (
              <Formik
                enableReinitialize
                onSubmit={submitHandler}
                initialValues={{}}
                validationSchema={Yup.object().shape(
                  FIELDS.reduce(CreateYupSchema, {})
                )}
              >
                {({ errors, touched }) => (
                  <Form className="flex justify-start items-center gap-x-4 bg-ghost-white h-fit mb-10">
                    {FIELDS.map((field) => (
                      <CustomField
                        key={field.name}
                        {...field}
                        description={
                          // @ts-ignore
                          touched[field.name] && errors[field.name]
                            ? // @ts-ignore
                              errors[field.name] ?? null
                            : null
                        }
                      />
                    ))}

                    <button
                      type="submit"
                      className="bg-green-yellow text-black font-medium px-4 py-3 w-96"
                      disabled={Object.keys(errors).length > 0 || loading}
                    >
                      {loading ? "loading..." : "Add Bid"}
                    </button>
                  </Form>
                )}
              </Formik>
            )}

            {!bids.length ? (
              <p className="text-4xl m-auto">No lendings found!</p>
            ) : (
              bids.map((bid) => (
                <article
                  key={bid.id}
                  className="border-2 bg-ghost-white p-4 w-full grid grid-cols-3 gap-x-4 border-green-yellow h-fit first-of-type:bg-green-yellow first-of-type:font-bold"
                >
                  <p title={bid.wallet_address}>
                    {Truncate(bid.wallet_address)}
                  </p>
                  <p>
                    {bid.amount} {item?.input_ticker}
                  </p>
                  <p>{TimestampParser(bid.created_at, "relative")}</p>
                </article>
              ))
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default LoadIDPage;
