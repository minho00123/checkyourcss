import { FaCheck } from "react-icons/fa";
import Detail from "./Detail";
import { useState } from "react";

function Result({
  isPerfect,
  cssInfo,
  userSelections,
  cssData,
  browsers,
  cssCompatibilityResult,
}) {
  const notSupportedProperties = [];
  const partialSupportProperties = [];
  const [isDetailClicked, setIsDetailClicked] = useState(false);
  const [isClickNotSupportCss, setIsClickNotSupportCss] = useState(true);
  const [clickedValue, setClickedValue] = useState("");

  cssCompatibilityResult.forEach(item => {
    if (item.compatibility.includes("n")) {
      notSupportedProperties.push(item.property);
    }

    if (item.compatibility.includes("a")) {
      partialSupportProperties.push(item.property);
    }
  });

  function handlePropertyClick(ev) {
    setClickedValue(ev.target.value);

    if (notSupportedProperties.includes(ev.target.value)) {
      setIsClickNotSupportCss(true);
    } else {
      setIsClickNotSupportCss(false);
    }

    setIsDetailClicked(true);
  }

  const deduplicatedNotSupportedProperties = [
    ...new Set(notSupportedProperties),
  ];
  const deduplicatedPartialSupportProperties = [
    ...new Set(partialSupportProperties),
  ];

  return (
    <>
      {isPerfect ? (
        <main className="flex justify-center items-center flex-col h-screen">
          <p className="mb-5 flex">
            CSS Compatibility in your Browser,{" "}
            {userSelections.map((selection, index) => {
              return (
                <div key={index} className="mx-2">
                  <span className="font-bold">{selection.browser} </span>
                  <span className="font-bold">
                    {selection.version}
                    {userSelections.length - 1 === index ? "" : ","}{" "}
                  </span>
                </div>
              );
            })}
            is
          </p>
          <div className="flex items-center flex-col relative w-4/5 h-96 rounded-2xl bg-green-200">
            <div className="flex justify-center items-center w-40 h-40 bg-green rounded-full mt-16 mb-16 text-7xl text-white">
              <FaCheck />
            </div>
            <p className="text-6xl">Perfect!</p>
          </div>
        </main>
      ) : (
        <>
          {!isDetailClicked ? (
            <main className="flex justify-center items-center flex-col h-screen pt-36">
              <div className="flex">
                CSS Compatibility in your Browser,{" "}
                {userSelections.map((selection, index) => {
                  return (
                    <div key={index} className="mx-2">
                      <span className="font-bold">{selection.browser}</span>
                      <span className="font-bold">
                        {selection.version}
                        {userSelections.length - 1 === index ? "" : ","}{" "}
                      </span>
                    </div>
                  );
                })}{" "}
                is
              </div>
              <div className="flex justify-evenly h-96 w-4/5 mb-2">
                <div className="flex items-center flex-col m-10">
                  <div className="flex justify-center items-center border-8 w-24 h-24 border-red rounded-full mb-2 text-4xl">
                    {deduplicatedNotSupportedProperties.length}
                  </div>
                  <div>Not Supported</div>
                </div>
                <div className="flex items-center flex-col m-10">
                  <div className="flex justify-center items-center border-8 w-24 h-24 border-yellow rounded-full mb-2 text-4xl">
                    {deduplicatedPartialSupportProperties.length}
                  </div>
                  <div>Partial Supported</div>
                </div>
              </div>
              <div className="h-4/5 w-4/5">
                <div className="flex items-center flex-col w-full mb-3">
                  <div className="text-xs self-start">Not Supported</div>
                  <form className="flex items-center w-full h-16 border-2 border-red">
                    {deduplicatedNotSupportedProperties.map(property => {
                      return (
                        <button
                          key={property}
                          value={property}
                          className="m-1 p-1 w-auto h-8 bg-red-200 ml-5"
                          onClick={handlePropertyClick}
                        >
                          {property}
                        </button>
                      );
                    })}
                  </form>
                </div>
                <div className="flex items-center flex-col w-full">
                  <div className="text-xs self-start">Partial Supported</div>
                  <form className="flex items-center w-full h-16 border-2 border-yellow">
                    {deduplicatedPartialSupportProperties.map(property => {
                      return (
                        <button
                          key={property}
                          value={property}
                          className="m-1 p-1 w-auto h-8 bg-yellow-200 ml-5"
                          onClick={handlePropertyClick}
                        >
                          {property}
                        </button>
                      );
                    })}
                  </form>
                </div>
              </div>
            </main>
          ) : (
            <Detail
              cssData={cssData}
              clickedValue={clickedValue}
              isNotSupportCss={isClickNotSupportCss}
              browsers={browsers}
              userSelections={userSelections}
              setIsDetailClicked={setIsDetailClicked}
              cssInfo={cssInfo}
            />
          )}
        </>
      )}
    </>
  );
}

export default Result;
