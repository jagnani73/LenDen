"use client";

import { CustomField } from "@/components/shared";
import { LOAN_TYPE, TICKER } from "@/utils/constants/services.constants";
import { CreateYupSchema } from "@/utils/functions";
import { acceptLoan, evaluateLoan } from "@/utils/services/api";
import { useUser } from "@/utils/store";
import { Evaluation } from "@/utils/types/services.types";
import { CustomFieldTypes, FieldClassnames } from "@/utils/types/shared.types";
import { Form, Formik } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useConnect, useSendTransaction, useSwitchNetwork } from "wagmi";
import * as Yup from "yup";
import { parseEther } from "ethers";
import { ContractWrite } from "@/components/wagmi";
import { Pixelify_Sans } from "next/font/google";
import { useRouter } from "next/navigation";

const pixelifySanse = Pixelify_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const BorrowPage: React.FC = () => {
  const { user } = useUser();

  const { push } = useRouter();

  const { connect, connectors } = useConnect();
  const { switchNetwork } = useSwitchNetwork();
  const { isLoading, sendTransaction } = useSendTransaction();

  const [loading, setLoading] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [form, setForm] = useState<"nft" | "token" | null>(null);
  const [nftTx, setNftTx] = useState<{
    mint_address: string;
    token_id: string;
    wallet_address: string;
  } | null>(null);

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

  const CLASSNAMES = useMemo<FieldClassnames>(
    () => ({
      wrapper: "w-full bg-transparent mt-2",
      input:
        "border-b border-green-yellow text-sm bg-transparent px-1 py-2 w-full outline-none",
      description: "text-red-700 text-xs font-medium my-0.5 pl-1",
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
          type: form === "nft" ? LOAN_TYPE.NFT : LOAN_TYPE.TOKEN,
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
    [form, user]
  );

  const acceptLoanHandler = useCallback(
    async (
      id: string,
      input_ticker: TICKER,
      data: {
        input_amount?: number;
        mint_address?: string;
        token_id?: string;
      }
    ) => {
      try {
        setLoading(true);
        const input_chain = connectors[0].chains.find(
          (chain) => chain.nativeCurrency.symbol === input_ticker
        );
        switchNetwork?.(input_chain?.id);
        connect({
          connector: connectors[0],
          chainId: input_chain?.id,
        });
        if (data.input_amount) {
          sendTransaction({
            to: "0xeC2265da865A947647CE6175a4a2646318f6DCEb",
            value: parseEther(data.input_amount.toString()),
          });
        } else if (data.mint_address && data.token_id) {
          setNftTx({
            mint_address: data.mint_address,
            token_id: data.token_id,
            wallet_address: user!.wallet_addresses[input_ticker].wallet_address,
          });
        }
        await acceptLoan(id);
        push("/loans");
      } catch (error) {
        console.error(error);
      } finally {
        setForm(null);
        setEvaluation(null);
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [connectors]
  );

  return (
    <main className="flex-1 w-full h-full p-10">
      <h2 className={`text-6xl ${pixelifySanse.className}`}>
        An{" "}
        <button
          type="button"
          className="font-bold underline hover:decoration-green-yellow transition-all"
          onClick={() => setForm("nft")}
          disabled={form === "nft"}
        >
          NFT based loan
        </button>{" "}
        or a{" "}
        <button
          type="button"
          className="font-bold underline hover:decoration-green-yellow transition-all"
          onClick={() => setForm("token")}
          disabled={form === "token"}
        >
          Token based loan
        </button>
      </h2>

      {form && (
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
              <Form className="w-96 border-2 border-green-yellow bg-ghost-white p-6 mt-10">
                <h1 className="text-5xl mb-4 text-center">
                  {form === "nft" ? "NFT Loan" : "Token Loan"}
                </h1>

                <p className="text-center text-opacity-75 mb-4">
                  Please fill in the following details...
                </p>

                <div className="flex flex-col gap-y-2 w-full">
                  {[
                    ...COMMON_FIELDS,
                    ...(form === "nft" ? NFT_FIELDS : TOKEN_FIELDS),
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
                  <p className="mt-4 text-sm">
                    You will get {evaluation.output_amount}{" "}
                    {evaluation.output_ticker} at an interest rate of{" "}
                    {evaluation.interest}% for {evaluation.period} weeks, making
                    the principal {evaluation.principal}{" "}
                    {evaluation.output_ticker}.
                  </p>
                )}

                <button
                  type={evaluation ? "button" : "submit"}
                  className="bg-green-yellow text-black text-xl mt-2 font-medium px-4 py-4 w-full"
                  disabled={
                    (!evaluation && Object.keys(errors).length > 0) || loading
                  }
                  onClick={() =>
                    evaluation &&
                    acceptLoanHandler(evaluation.id, evaluation.input_ticker, {
                      input_amount: evaluation.input_amount,
                      mint_address: evaluation.mint_address,
                      token_id: evaluation.token_id,
                    })
                  }
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

          {nftTx?.mint_address && nftTx?.token_id && nftTx.wallet_address ? (
            <ContractWrite
              address={nftTx.mint_address}
              token_id={+nftTx.token_id}
              wallet_address={nftTx.wallet_address}
            />
          ) : null}
        </div>
      )}
    </main>
  );
};

export default BorrowPage;
