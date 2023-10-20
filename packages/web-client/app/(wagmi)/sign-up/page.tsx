"use client";

import { useCallback, useMemo } from "react";
import { CustomFieldTypes, FieldClassnames } from "@/utils/types/shared.types";
import { Form, Formik } from "formik";
import { CreateYupSchema } from "@/utils/functions";
import * as Yup from "yup";
import { CustomField } from "@/components/shared";

const SignUpPage: React.FC = () => {
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

  const submitHandler = useCallback(() => {}, []);

  return (
    <main className="flex items-center justify-center w-full">
      <div className="flex flex-col gap-x-4 justify-center items-center">
        <Formik
          enableReinitialize
          onSubmit={submitHandler}
          initialValues={{ admin_email: "", admin_password: "" }}
          validationSchema={Yup.object().shape(
            FIELDS.reduce(CreateYupSchema, {})
          )}
        >
          {({ errors, touched }) => (
            <Form className="w-96 border border-neutral-600 rounded-md p-6">
              <h1 className="text-5xl mb-4 text-center">GM Ser!</h1>

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
                className="border bg-neutral-900 text-white rounded-md px-4 py-4 w-full mt-6"
              >
                Login
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
};

export default SignUpPage;