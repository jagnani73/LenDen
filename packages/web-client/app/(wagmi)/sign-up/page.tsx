"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CustomFieldTypes, FieldClassnames } from "@/utils/types/shared.types";
import { Form, Formik } from "formik";
import { CreateYupSchema } from "@/utils/functions";
import * as Yup from "yup";
import { CustomField } from "@/components/shared";
import {
  Chain,
  useAccount,
  useConnect,
  useDisconnect,
  useSignMessage,
} from "wagmi";
import { usersSignUp } from "@/utils/services/api";

const SignUpPage: React.FC = () => {
  const { connect, connectors, error: connectError } = useConnect();
  const { address, isConnected } = useAccount();
  const {
    signMessage,
    data: signature,
    error: signError,
    isSuccess: messageSigned,
  } = useSignMessage();
  const { disconnect } = useDisconnect();

  const [connectingChain, setConnectingChain] = useState<Chain | null>(null);
  const [connectedChains, setConnectedChains] = useState<{
    [ticker: string]: {
      wallet_address: string;
      signature: string;
    };
  }>({});

  useEffect(() => {
    disconnect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isConnected && connectingChain) {
      signMessage({
        message: `I am connecting my wallet to ${connectingChain.name}`,
      });
    }
  }, [connectingChain, isConnected, signMessage]);

  useEffect(() => {
    if (signature && connectingChain && address && messageSigned) {
      setConnectedChains((prevState) => ({
        ...prevState,
        [connectingChain.nativeCurrency.symbol]: {
          signature: signature,
          wallet_address: address,
        },
      }));
      disconnect();
    }
  }, [address, connectingChain, disconnect, messageSigned, signature]);

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

  const submitHandler = useCallback(
    async (values: { username: string; password: string }) => {
      await usersSignUp(values.username, values.password, connectedChains);
    },
    [connectedChains]
  );

  return (
    <main className="flex items-center justify-center w-full">
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

              <div className="my-8">
                <p className="text-sm mb-2 text-center">
                  We need you to connect a wallet to these chains
                </p>

                {connectors.map((connector) => (
                  <article
                    key={connector.name}
                    className="flex items-center justify-center gap-x-6"
                  >
                    {connector.chains.map((chain) => {
                      const chainAdded: boolean = Object.keys(
                        connectedChains
                      ).includes(chain.nativeCurrency.symbol);

                      return (
                        <button
                          type="button"
                          key={chain.name}
                          className={`border rounded border-neutral-600 px-4 py-2 ${
                            chainAdded ? "opacity-50" : ""
                          }`}
                          disabled={chainAdded}
                          onClick={() => {
                            setConnectingChain(chain);
                            connect({
                              connector: connector,
                              chainId: chain.id,
                            });
                          }}
                        >
                          {chain.name}
                        </button>
                      );
                    })}
                  </article>
                ))}
              </div>

              <button
                type="submit"
                className="border bg-neutral-900 text-white rounded-md px-4 py-4 w-full"
                disabled={
                  Object.keys(errors).length > 0 ||
                  Object.keys(connectedChains).length < 2
                }
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
