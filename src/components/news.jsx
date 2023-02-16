import React, { useState, useEffect } from "react";
import axios from "axios";

const NewsPage = () => {
  const [news, setNews] = useState({ data: [], count: 0, page: 1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://api.coingecko.com/api/v3/news`)
      .then((response) => {
        setNews(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [news.page]);

  const filteredNews = news.data.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(news);

  return (
    <div className="text-white rounded-md shadow-md p-6  justify-items-center ">
      <h1 className="text-3xl font-bold text-gray-200 mb-6 ">Latest News</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="m-auto">
          {filteredNews.length === 0 ? (
            <p>No results found.</p>
          ) : (
            <>
              {filteredNews.map((article, index) => (
                <div
                  key={index}
                  className="p-6 border border-gray-500 rounded-md mb-6 flex m-auto bg-gray-600 bg-opacity-25 flex-col sm:flex-row items-center"
                  style={{
                    maxWidth: "800px",
                    maxHeight: "500px",
                  }}
                >
                  {article.thumb_2x && (
                    <img
                      src={article.thumb_2x}
                      alt={article.title}
                      className="w-full sm:w-40 h-40 object-cover rounded-md mr-0 sm:mr-6 mb-4 sm:mb-0"
                    />
                  )}
                  <div className="flex-1">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-medium  hover:text-blue-600"
                    >
                      {article.title}
                    </a>
                    <p className="mt-2">{article.published_at}</p>
                    <p className="mt-2">
                      {article.description.slice(0, 120)}
                      {article.description.length > 120 && "..."}
                    </p>
                    <div className="mt-2 flex flex-col text-gray-500">
                      <span>Author: {article.author}</span>
                      <span>Source: {article.news_site}</span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsPage;
