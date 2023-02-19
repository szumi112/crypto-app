import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Pagination = ({
  tradesPerPage,
  totalTrades,
  paginate,
  currentPage,
  closedTrades,
}) => {
  const indexOfLastTrade = currentPage * tradesPerPage;
  const indexOfFirstTrade = indexOfLastTrade - tradesPerPage;
  const currentTrades = closedTrades.slice(indexOfFirstTrade, indexOfLastTrade);
  const maxPage = Math.ceil(totalTrades / tradesPerPage);
  const pageNumbers = [];

  for (let i = 1; i <= maxPage; i++) {
    pageNumbers.push(i);
  }

  const handlePagination = (direction) => {
    if (direction === "previous") {
      if (currentPage > 1) {
        paginate(currentPage - 1, "previous");
      }
    } else if (direction === "next") {
      if (currentPage < maxPage) {
        paginate(currentPage + 1, "next");
      }
    }
  };

  return (
    <nav className="flex items-center justify-center bg-transparent ">
      <ul className="flex border border-transparent rounded-md ">
        <li>
          <button
            onClick={() => handlePagination("previous")}
            className={`${
              currentPage === 1
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200"
            } px-3 py-2 rounded-l-md focus:outline-none bg-opacity-80 `}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`${
                currentPage === number
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              } px-3 py-2 focus:outline-none bg-opacity-80`}
            >
              {number}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => handlePagination("next")}
            className={`${
              currentPage === maxPage
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200"
            } px-3 py-2 rounded-r-md focus:outline-none bg-opacity-80 `}
            disabled={currentPage === maxPage}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
