import { useParams } from "react-router-dom";
import fetchAxios from "../customHooks/fetchAxios";
import Skeleton from "./Skeleton";

const CoinDetail = () => {
  const { id } = useParams();
  const { response } = fetchAxios(
    `coins/${id}?localization=false&tickers=false&market_data=false&community_data=false&sparkline=false`
  );

  if (!response) {
    return (
      <div className="wrapper-container mt-8">
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-72 w-full mb-10" />
      </div>
    );
  }

  return (
    <div
      className=" flex flex-col justify-center p-6 mb-4  w-9/12 mx"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        margin: "25px auto",
      }}
    >
      <div className="flex flex-col items-center">
        <img src={response.image.small} alt={response.name} />
        <h1 className="text-2xl mb-2 capitalize font-bold">{response.name}</h1>
      </div>
      <p
        className="mt-6 text-white [&>a]:text-blue-600 [&>a]:underline"
        dangerouslySetInnerHTML={{ __html: response.description.en }}
      ></p>
    </div>
  );
};

export default CoinDetail;
