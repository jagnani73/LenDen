import Link from "next/link";

const HomePage: React.FC = () => {
  return (
    <main className="flex items-center justify-center w-full">
      <div className="flex gap-x-4 justify-center items-center">
        <Link
          href={"/sign-up"}
          className="border border-neutral-900 rounded-md px-4 py-2"
        >
          Sign Up
        </Link>
        <Link
          href={"/sign-in"}
          className="border border-neutral-900 rounded-md px-4 py-2"
        >
          Sign In
        </Link>
      </div>
    </main>
  );
};

export default HomePage;
