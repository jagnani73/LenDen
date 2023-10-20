"use client";

import { LOAN_TYPE } from "@/utils/constants/services.constants";
import {
  acceptLoan,
  evaluateLoan,
  fetchLoansForUsername,
} from "@/utils/services/api";
import { useUser } from "@/utils/store";
import { Evaluation, Loan } from "@/utils/types/services.types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CustomFieldTypes, FieldClassnames } from "@/utils/types/shared.types";
import { Form, Formik } from "formik";
import { CustomField } from "@/components/shared";
import { CreateYupSchema } from "@/utils/functions";
import * as Yup from "yup";

const LoansPage: React.FC = () => {
  const { user } = useUser();

  const { push, replace } = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [loans, setLoans] = useState<Loan[] | null>(null);
  const [onForm, setOnForm] = useState<"nft" | "token" | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);

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

  const CLASSNAMES = useMemo<FieldClassnames>(
    () => ({
      wrapper: "w-full",
      input: "border border-neutral-900 rounded-md px-4 py-4 w-full",
      description: "text-red-600 text-sm font-medium my-0.5 pl-1",
    }),
    []
  );

  const COMMON_FIELDS = useMemo<CustomFieldTypes[]>(
    () => [
      {
        id: "input_ticker",
        name: "input_ticker",
        type: "select",
        choices: [
          {
            content: "Avalanche Fuji",
            value: "AVAX",
          },
          {
            content: "Polygon Mumbai",
            value: "MATIC",
          },
        ],
        placeholder: "Enter the input chain",
        validationtype: "string",
        validations: [
          {
            type: "required",
            params: ["this field is mandatory"],
          },
        ],
        classnames: CLASSNAMES,
      },
      {
        id: "output_ticker",
        name: "output_ticker",
        type: "select",
        choices: [
          {
            content: "Avalanche Fuji",
            value: "AVAX",
          },
          {
            content: "Polygon Mumbai",
            value: "MATIC",
          },
        ],
        placeholder: "Enter the output chain",
        validationtype: "string",
        validations: [
          {
            type: "required",
            params: ["this field is mandatory"],
          },
        ],
        classnames: CLASSNAMES,
      },
      {
        id: "period",
        name: "period",
        type: "select",
        choices: [
          {
            content: "1 week",
            value: 1,
          },
          {
            content: "2 weeks",
            value: 2,
          },
          {
            content: "3 weeks",
            value: 3,
          },
        ],
        placeholder: "Enter the period time",
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

  const NFT_FIELDS = useMemo<CustomFieldTypes[]>(
    () => [
      {
        id: "mint_address",
        name: "mint_address",
        type: "text",
        placeholder: "Enter the NFT Address",
        validationtype: "string",
        validations: [
          {
            type: "required",
            params: ["this field is mandatory"],
          },
        ],
        classnames: CLASSNAMES,
      },
      {
        id: "token_id",
        name: "token_id",
        type: "text",
        placeholder: "Enter the Token ID",
        validationtype: "string",
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

  const TOKEN_FIELDS = useMemo<CustomFieldTypes[]>(
    () => [
      {
        id: "input_amount",
        name: "input_amount",
        type: "number",
        placeholder: "Enter the Input Amount",
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
        const _evaluation = await evaluateLoan({
          ...values,
          start_time: new Date().toISOString(),
          type: onForm === "nft" ? LOAN_TYPE.NFT : LOAN_TYPE.TOKEN,
          period_unit: "weeks",
          period: +values.period,
          username: user?.username ?? "hs",
          input_wallet_address:
            user!.wallet_addresses[values.input_ticker].wallet_address,
          output_wallet_address:
            user!.wallet_addresses[values.output_ticker].wallet_address,
        });
        setEvaluation(_evaluation);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [onForm, user]
  );

  const acceptLoanHandler = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        await acceptLoan(id);
        push("/loans");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <main className="w-full">
      <p className="my-8 text-center text-4xl">
        Take an{" "}
        <button
          type="button"
          className="font-bold hover:underline"
          onClick={() => setOnForm("nft")}
          disabled={onForm === "nft"}
        >
          NFT based loan
        </button>{" "}
        or a{" "}
        <button
          type="button"
          className="font-bold hover:underline"
          onClick={() => setOnForm("token")}
          disabled={onForm === "token"}
        >
          Token based loan
        </button>
      </p>

      {!loans ? (
        <p>loading</p>
      ) : !onForm ? (
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
      ) : (
        <div className="flex flex-col gap-x-4 justify-center items-center">
          <Formik
            enableReinitialize
            onSubmit={submitHandler}
            initialValues={{}}
            validationSchema={Yup.object().shape(
              COMMON_FIELDS.reduce(CreateYupSchema, {})
            )}
          >
            {({ errors, touched }) => (
              <Form className="w-96 border border-neutral-600 rounded-md p-6 mt-12">
                <h1 className="text-5xl mb-4 text-center">
                  {onForm === "nft" ? "NFT Loan" : "Token Loan"}
                </h1>

                <p className="text-center text-opacity-75 mb-4">
                  Please fill in the following details...
                </p>

                <div className="flex flex-col gap-y-2 w-full">
                  {[
                    ...COMMON_FIELDS,
                    ...(onForm === "nft" ? NFT_FIELDS : TOKEN_FIELDS),
                  ].map((field) => (
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

                {evaluation && (
                  <p className="my-3 text-sm">
                    You will get {evaluation.output_amount}{" "}
                    {evaluation.output_ticker} at an interest rate of{" "}
                    {evaluation.interest}% for {evaluation.period} weeks, making
                    the principal {evaluation.principal}{" "}
                    {evaluation.output_ticker}.
                  </p>
                )}

                <button
                  type={evaluation ? "button" : "submit"}
                  className="border bg-neutral-900 text-white rounded-md mt-6 px-4 py-4 w-full"
                  disabled={
                    (!evaluation && Object.keys(errors).length > 0) || loading
                  }
                  onClick={() => evaluation && acceptLoanHandler(evaluation.id)}
                >
                  {loading
                    ? "loading..."
                    : !evaluation
                    ? "Evaluate Loan"
                    : "Accept"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </main>
  );
};

export default LoansPage;
