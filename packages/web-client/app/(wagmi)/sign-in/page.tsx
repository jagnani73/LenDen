"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CustomFieldTypes, FieldClassnames } from "@/utils/types/shared.types";
import { Form, Formik } from "formik";
import { CreateYupSchema } from "@/utils/functions";
import * as Yup from "yup";
import { CustomField } from "@/components/shared";
import { usersSignIn } from "@/utils/services/api";
import { useUser } from "@/utils/store";
import { useRouter } from "next/navigation";

const SignInPage: React.FC = () => {
  const { setUser } = useUser();

  const { push } = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const CLASSNAMES = useMemo<FieldClassnames>(
    () => ({
      wrapper: "w-full bg-transparent mt-2",
      input:
        "border-b border-green-yellow text-sm bg-transparent px-1 py-2 w-full outline-none",
      description: "text-red-700 text-xs font-medium my-0.5 pl-1",
    }),
    []
  );

  const FIELDS = useMemo<CustomFieldTypes[]>(
    () => [
      {
        id: "username",
        name: "username",
        type: "text",
        placeholder: "Create a username",
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
        id: "password",
        name: "password",
        type: "password",
        placeholder: "Enter the password",
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

  const submitHandler = useCallback(
    async (values: { username: string; password: string }) => {
      try {
        setLoading(true);
        const { token, wallet_addresses } = await usersSignIn(
          values.username,
          values.password
        );
        setUser({
          authToken: token,
          username: values.username,
          wallet_addresses: wallet_addresses,
        });
        push("/loans");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [push, setUser]
  );

  return (
    <main className="h-full flex items-center justify-center w-full">
      <div className="flex flex-col gap-x-4 justify-center items-center">
        <Formik
          enableReinitialize
          onSubmit={submitHandler}
          initialValues={{ username: "", password: "" }}
          validationSchema={Yup.object().shape(
            FIELDS.reduce(CreateYupSchema, {})
          )}
        >
          {({ errors, touched }) => (
            <Form className="w-96 border-2 border-green-yellow bg-ghost-white p-6">
              <h1 className="text-5xl mb-4 text-center">GM Ser!</h1>

              <p className="text-center text-opacity-75 mb-4">
                Please fill in the following details...
              </p>

              <div className="flex flex-col gap-y-2 w-full my-8">
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
                className="bg-green-yellow text-black text-xl font-medium px-4 py-4 w-full"
                disabled={Object.keys(errors).length > 0 || loading}
              >
                {!loading ? "Sign In" : "loading..."}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
};

export default SignInPage;
