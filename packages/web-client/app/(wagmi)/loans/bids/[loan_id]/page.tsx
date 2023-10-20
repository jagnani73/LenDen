"use client";

import { CustomField } from "@/components/shared";
import { CreateYupSchema, TimestampParser } from "@/utils/functions";
import { addBid, fetchBidItem, fetchBids } from "@/utils/services/api";
import { useUser } from "@/utils/store";
import { Bid, Loan } from "@/utils/types/services.types";
import { CustomFieldTypes, FieldClassnames } from "@/utils/types/shared.types";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as Yup from "yup";

const LoadIDPage: React.FC<{ params: { loan_id: string } }> = ({
  params: { loan_id },
}) => {
  const { user } = useUser();

  const [loading, setLoading] = useState<boolean>(false);
  const [item, setItem] = useState<Loan | null>(null);
  const [bids, setBids] = useState<Bid[] | null>(null);

  useEffect(() => {
    if (user && loan_id) {
      (async () => {
        const [_bids, _item] = await Promise.all([
          fetchBids(loan_id),
          fetchBidItem(loan_id),
        ]);
        if (_item) {
          setItem(_item);
        }
        if (_bids) {
          setBids(_bids);
        }
      })();
    }
  }, [loan_id, user]);

  const CLASSNAMES = useMemo<FieldClassnames>(
    () => ({
      wrapper: "w-full",
      input: "border border-neutral-900 rounded-md px-4 py-4 w-full",
      description: "text-red-600 text-sm font-medium my-0.5 pl-1",
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
    <main className="flex flex-col gap-x-4 justify-center items-center w-full">
      <Link href="/loans">View my loans</Link>

      {!bids ? (
        <p>loading</p>
      ) : (
        <div className="flex gap-8 flex-wrap">
          <p>Current bids</p>

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
                <Form className="w-96 border border-neutral-600 rounded-md p-6 mt-12">
                  <div>
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
                  </div>

                  <button
                    type="submit"
                    className="border bg-neutral-900 text-white rounded-md mt-6 px-4 py-4 w-full"
                    disabled={Object.keys(errors).length > 0 || loading}
                  >
                    {loading ? "loading..." : "Add Bid"}
                  </button>
                </Form>
              )}
            </Formik>
          )}

          {!bids.length ? (
            <p>no bids found</p>
          ) : (
            bids.map((bid) => (
              <article
                key={bid.id}
                className="mx-auto border rounded-md border-neutral-600 p-4 h-full"
              >
                <p>Made: {TimestampParser(bid.created_at, "relative")}</p>
                <p>
                  Amount: {bid.amount} {item?.input_ticker}
                </p>
                <p>By: {bid.wallet_address}</p>
              </article>
            ))
          )}
        </div>
      )}
    </main>
  );
};

export default LoadIDPage;
