"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CustomField, Dropdown } from ".";
import { CustomFieldTypes } from "@/utils/types/shared.types";
import { Form, Formik } from "formik";
import { CreateYupSchema } from "@/utils/functions";
import * as Yup from "yup";
import { optOutOfNotification } from "@/utils/services/api";
import { useUser } from "@/utils/store";

const Navbar: React.FC = () => {
  const { user } = useUser();

  const path = usePathname();

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [newValues, setNewValues] = useState<string[]>(["0", "1", "2", "3"]);

  const FIELDS = useMemo<CustomFieldTypes[]>(
    () => [
      {
        id: "notifs",
        name: "notifs",
        type: "checkbox",
        choices: [
          {
            text: "New Auction Available",
            value: "0",
          },
          {
            text: "Warning Notification",
            value: "1",
          },
          {
            text: "Successful Transactions",
            value: "2",
          },
          {
            text: "Move to Bidding",
            value: "3",
          },
        ],
      },
    ],
    []
  );

  useEffect(() => {
    if (!dropdownOpen && user) {
      (async () => {
        try {
          await optOutOfNotification(newValues, user.username);
        } catch (error) {
          console.error(error);
        }
      })();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownOpen, user]);

  const NAVIGATION = useMemo<{
    prompt?: string;
    routes: { href: string; content: string }[];
  }>(() => {
    switch (path) {
      case "/": {
        return {
          prompt: "Get into Cross-Chain DeFi",
          routes: [
            {
              content: "Sign Up",
              href: "/sign-up",
            },
            {
              content: "Sign In",
              href: "/sign-in",
            },
          ],
        };
      }
      case "/sign-up": {
        return {
          routes: [
            {
              content: "Sign In",
              href: "/sign-in",
            },
          ],
        };
      }
      case "/sign-in": {
        return {
          routes: [
            {
              content: "Sign Up",
              href: "/sign-up",
            },
          ],
        };
      }
      case "/loans": {
        return {
          routes: [
            {
              content: "New Loan",
              href: "/loans/borrow",
            },
            {
              content: "Lendings",
              href: "/lendings",
            },
          ],
        };
      }
      case "/loans/borrow": {
        return {
          routes: [
            {
              content: "Active Loans",
              href: "/loans",
            },
            {
              content: "Lendings",
              href: "/lendings",
            },
          ],
        };
      }
      case "/lendings": {
        return {
          routes: [
            {
              content: "Active Loans",
              href: "/loans",
            },
            {
              content: "New Loan",
              href: "/loans/borrow",
            },
          ],
        };
      }

      default:
        return {
          routes: [
            {
              content: "Active Loans",
              href: "/loans",
            },
            {
              content: "New Loan",
              href: "/loans/borrow",
            },
            {
              content: "Lendings",
              href: "/lendings",
            },
          ],
        };
    }
  }, [path]);

  const submitHandler = useCallback(async (values: any) => {
    try {
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <nav className="h-24 w-full px-20 flex items-center justify-between bg-white border-b border-french-grey">
      <Link href="/" className="flex items-center gap-x-8" title="LenDen">
        <Image src="/site/logo.svg" alt="LenDen logo" width={88} height={88} />
        <h1 className="text-4xl font-semibold">LenDen</h1>
      </Link>

      <div className="flex items-center justify-center gap-x-8">
        {NAVIGATION.prompt && (
          <p className="font-medium text-lg text-french-grey">
            {NAVIGATION.prompt}
          </p>
        )}

        {NAVIGATION.routes.map(({ content, href }) => (
          <Link
            key={href + content}
            href={href}
            className="bg-green-yellow border border-green-yellow px-6 py-3 font-medium"
          >
            {content}
          </Link>
        ))}

        {path !== "/" && path !== "/sign-in" && path !== "/sign-up" && (
          <Dropdown
            open={dropdownOpen}
            setOpen={setDropdownOpen}
            persist
            trigger="hover"
            dropdownClassname="right-0"
            options={[
              <Formik
                key="drop"
                enableReinitialize
                onSubmit={submitHandler}
                initialValues={{
                  notifs: newValues,
                }}
                validationSchema={Yup.object().shape(
                  FIELDS.reduce(CreateYupSchema, {})
                )}
              >
                {({ errors, touched, values }) => {
                  setNewValues(values.notifs);
                  return (
                    <Form className="bg-ghost-white right-0 overflow-auto whitespace-nowrap px-4 py-2 border-2 border-green-yellow mt-4">
                      {FIELDS.map((field) => (
                        <CustomField
                          key={field.id}
                          {...field}
                          description={
                            // @ts-ignore
                            touched[field.name] && errors[field.name]
                              ? // @ts-ignore
                                errors[field.name] ?? null
                              : null
                          }
                          classnames={{
                            wrapper: "flex flex-col justify-center",
                            label: "flex gap-x-4",
                          }}
                        />
                      ))}
                    </Form>
                  );
                }}
              </Formik>,
            ]}
          >
            <button className="ml-4" type="button">
              <Image
                src="/notification.svg"
                alt="bell icon"
                width={24}
                height={24}
              ></Image>
            </button>
          </Dropdown>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
