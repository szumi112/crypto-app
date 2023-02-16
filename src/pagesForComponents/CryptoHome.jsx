import Markets from "../components/Markets";
import Trending from "../components/Trending";
import "../index.css";

const CryptoHome = () => {
  return (
    <div className="wrapper-container">
      <Trending />
      <Markets />
    </div>
  );
};

export default CryptoHome;
