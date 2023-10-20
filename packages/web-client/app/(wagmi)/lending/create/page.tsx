"use client";

import { CustomFieldTypes, FieldClassnames } from "@/utils/types/shared.types";
import { parseEther } from "ethers";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSendTransaction } from "wagmi";
import { createLending } from "@/utils/services/api";
import { useUser } from "@/utils/store";
import { CreateYupSchema } from "@/utils/functions";
import { CustomField } from "@/components/shared";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CreatePage: React.FC = () => {
  const { user } = useUser();

  const { push } = useRouter();

  const { sendTransaction, isSuccess } = useSendTransaction();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isSuccess) {
      push("/lending");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

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
        id: "ticker",
        name: "ticker",
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
        id: "amount",
        name: "amount",
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

  const submitHandler = useCallback(
    async (values: any) => {
      try {
        setLoading(true);
        sendTransaction({
          to: "0xeC2265da865A947647CE6175a4a2646318f6DCEb",
          value: parseEther(values.amount.toString()),
        });
        const wallet_address =
          user!.wallet_addresses[values.ticker].wallet_address;
        await createLending(
          wallet_address,
          values.ticker,
          values.amount,
          +values.period,
          user!.username
        );
      } catch (error) {
        console.error(error);
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  );

  return (
    <main className="w-full flex flex-col gap-x-4 justify-center items-center">
      <Link href="/lending">View my lendings</Link>

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
            <h1 className="text-5xl mb-4 text-center">Lend Assets</h1>

            <p className="text-center text-opacity-75 mb-4">
              Please fill in the following details...
            </p>

            <div className="flex flex-col gap-y-2 w-full">
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
              {loading ? "loading..." : "Lend"}
            </button>
          </Form>
        )}
      </Formik>
    </main>
  );
};

export default CreatePage;
