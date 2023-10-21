import { Pixelify_Sans } from "next/font/google";

const pixelifySanse = Pixelify_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const HomePage: React.FC = () => {
  return (
    <main className="flex flex-col min-h-full">
      <h2
        className={`text-9xl ${pixelifySanse.className} font-bold text-center`}
      >
        Cross Chain
      </h2>
      <h3 className={`text-6xl ${pixelifySanse.className} text-center mt-8`}>
        Borrow. Reputation. Auction. Lend.
      </h3>
    </main>
  );
};

export default HomePage;
