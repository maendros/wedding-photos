import TabNavigation from "@components/TabNavigation";
import Image from "next/image";
import { Great_Vibes } from "@next/font/google";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <h1
        className={`text-center text-2xl md:text-2xl lg:text-4xl ${greatVibes.className} my-4`}
      >
        Καλωσήρθατε στη σελίδα μας.
      </h1>
      <p
        className={`text-center md:text-md lg:text-xl ${greatVibes.className} mb-4`}
      >
        Αποτυπώστε αυτήν την ξεχωριστή μέρα για μας μέσα από τα δικά σας μάτια.
      </p>
      <div className="flex flex-col items-center mb-4">
        <div className="w-11/12 sm:w-3/4 md:w-3/4 lg:w-2/3 xl:w-3/12 mb-2">
          <Image
            src="/family.jpg"
            alt="Family"
            layout="responsive"
            width={1458}
            height={978}
            className="rounded-lg"
          />
        </div>
        <p className={`text-center text-lg ${greatVibes.className} mb-1`}>
          19/07/2024
        </p>
        <p className={`text-center text-lg ${greatVibes.className}`}>
          Κώστας - Ρούλα - Αλέξανδρος
        </p>
      </div>
      <TabNavigation />
    </div>
  );
};

export default Home;
