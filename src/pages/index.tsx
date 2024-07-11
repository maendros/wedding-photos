import TabNavigation from "@components/TabNavigation";
import Image from "next/image";

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-2xl font-bold my-4">
        {" "}
        Καλωσήρθατε στη σελίδα μας.
      </h1>
      <p className="text-center text-md mb-4">
        Αποτυπώστε αυτήν την ξεχωριστή μέρα για μας μεσα από τα δικά σας μάτια.
      </p>
      <div className="flex flex-col items-center mb-4">
        <div className="w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-5/12 mb-2">
          <Image
            src="/family.jpg"
            alt="Family"
            layout="responsive"
            width={1458}
            height={978}
            className="rounded-lg"
          />
        </div>
        <p className="text-center text-lg mb-1">19/07/2024</p>
        <p className="text-center text-lg">Κώστας - Ρούλα - Αλέξανδρος</p>
      </div>
      <TabNavigation />
    </div>
  );
};

export default Home;
