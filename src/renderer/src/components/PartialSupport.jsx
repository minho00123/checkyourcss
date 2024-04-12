import React from "react";

function PartialSupport({
  cssProperty,
  userSelections,
  cssData,
  browsers,
  cssInfo,
}) {
  userSelections.forEach(userSelect => {
    const browser = userSelect.browser;

    browsers[browser].versionsNotSupport = [];
    browsers[browser].versionsPartiallySupport = [];
    browsers[browser].versionsSupport = [];

    const browserCompatibilityByVersions =
      cssData.data[cssProperty].stats[browsers[userSelect.browser].stat];

    const exactUserSelectVersionNoteNum =
      browserCompatibilityByVersions[userSelect.version].match(/\d+/g);

    const exactVersionNum = exactUserSelectVersionNoteNum
      ? exactUserSelectVersionNoteNum.join("")
      : "";

    browsers[browser].selectVersionNote =
      cssData.data[cssProperty].notes_by_num[exactVersionNum];

    for (const version in browserCompatibilityByVersions) {
      const compatibility = browserCompatibilityByVersions[version];

      if (compatibility === "n") {
        browsers[browser].versionsNotSupport.push(version);
      } else if (compatibility.includes("a")) {
        browsers[browser].versionsPartiallySupport.push(version);
      } else if (compatibility === "y") {
        browsers[browser].versionsSupport.push(version);
      }
    }

    browsers[browser].versionsNotSupport.sort((a, b) => a - b);
    browsers[browser].versionsPartiallySupport.sort((a, b) => a - b);
    browsers[browser].versionsSupport.sort((a, b) => a - b);
  });

  const propertyInfo = [];

  if (cssInfo[0].cssProperties) {
    cssInfo.forEach(info => {
      if (info.fileContent.includes(cssProperty)) {
        const fileContent = info.fileContent.split("\n");
        const lineInfo = {
          path: info.filePath,
          lines: [],
          contents: fileContent,
        };

        for (let i = 0; i < fileContent.length; i++) {
          if (fileContent[i].includes(cssProperty)) {
            lineInfo.lines.push(i);
          }
        }

        propertyInfo.push(lineInfo);
      }
    });
  } else {
    const tailwindCssClasses = [];

    cssInfo.forEach(info => {
      if (Object.keys(info.cssMatching).includes(cssProperty)) {
        tailwindCssClasses.push(...info.cssMatching[cssProperty]);
      }
    });

    const uniqueTailwindCssClasses = [...new Set(tailwindCssClasses)];

    cssInfo.forEach(info => {
      uniqueTailwindCssClasses.forEach(tailwindCssClass => {
        if (info.content.includes(tailwindCssClass)) {
          const fileContent = info.content.split("\n");
          const lineInfo = {
            tailwindClass: tailwindCssClass,
            path: info.filePath,
            lines: [],
            contents: fileContent,
          };

          for (let i = 0; i < fileContent.length; i++) {
            if (fileContent[i].includes(tailwindCssClass)) {
              lineInfo.lines.push(i);
            }
          }

          propertyInfo.push(lineInfo);
        }
      });
    });
  }

  async function handleGoToYourCodeClick() {
    await window.loadProjectAPI.openFiles(propertyInfo);
  }

  return (
    <div
      data-testid="partial-support-component"
      className="flex flex-col justify-center items-center"
    >
      <h3 className="text-3xl font-bold">
        <span className="text-yellow">{cssProperty}</span> is partially
        supported.
      </h3>
      <div className="flex flex-col w-5/6 mt-10">
        <div className="mx-5 my-2 p-4 h-auto bg-yellow-200">
          {propertyInfo.map(info => {
            return (
              <>
                <p className="font-bold">{info.path}</p>
                <p>
                  {" "}
                  {info.lines.map((line, index) => {
                    if (index === 0) {
                      return <span>{`line ${line + 1}, `}</span>;
                    } else if (info.lines.length - 1 === index) {
                      return <span>{`${line + 1}`}</span>;
                    } else {
                      return <span>{`${line + 1}, `}</span>;
                    }
                  })}
                </p>
                {info.lines.map(number => {
                  return (
                    <pre className="whitespace-normal m-3 px-5 py-3 bg-black text-white">
                      {`${number + 1} ${info.contents[number]}`}
                    </pre>
                  );
                })}
              </>
            );
          })}
        </div>
        <div className="flex justify-evenly items-center flex-col w-full mt-10">
          <div className="w-full">
            {userSelections.map((selection, index) => (
              <div key={index} className="flex justify-around w-full mb-10">
                <div className="mx-3">
                  <h4 className="text-2xl font-extrabold">
                    {selection.browser}
                  </h4>
                  <p className="text-xs">Your version "{selection.version}"</p>
                  <div>
                    {browsers[selection.browser].versionsNotSupport.length !==
                      0 && (
                      <div className="flex justify-center items-center h-12 bg-red text-xl text-white">
                        {browsers[selection.browser].versionsNotSupport[0]} -{" "}
                        {
                          browsers[selection.browser].versionsNotSupport[
                            browsers[selection.browser].versionsNotSupport
                              .length - 1
                          ]
                        }
                      </div>
                    )}
                    {browsers[selection.browser].versionsPartiallySupport
                      .length !== 0 && (
                      <div className="flex justify-center items-center h-12 mt-3 bg-yellow text-xl text-white">
                        {
                          browsers[selection.browser]
                            .versionsPartiallySupport[0]
                        }{" "}
                        -{" "}
                        {
                          browsers[selection.browser].versionsPartiallySupport[
                            browsers[selection.browser].versionsPartiallySupport
                              .length - 1
                          ]
                        }
                      </div>
                    )}
                    {browsers[selection.browser].versionsSupport.length !==
                      0 && (
                      <div className="flex justify-center items-center h-12 mt-3 bg-green text-xl text-white">
                        {browsers[selection.browser].versionsSupport[0]} -{" "}
                        {
                          browsers[selection.browser].versionsSupport[
                            browsers[selection.browser].versionsSupport.length -
                              1
                          ]
                        }
                      </div>
                    )}
                  </div>
                </div>
                <div className="mx-5 my-2 p-4 w-4/5 h-auto bg-yellow-200">
                  <h4></h4>
                  <h5 className="font-bold">Description</h5>
                  <p className="bg-yellow-300 mb-3">
                    {browsers[selection.browser].selectVersionNote}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleGoToYourCodeClick}
            className="m-12 px-6 py-2 rounded-xl bg-black text-lg text-white font-bold hover:bg-gray hover:text-black"
          >
            Go to Your Code!
          </button>
        </div>
      </div>
    </div>
  );
}

export default PartialSupport;
