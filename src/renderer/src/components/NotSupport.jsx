import bcd from "@mdn/browser-compat-data";

function NotSupport({
  cssData,
  cssProperty,
  userSelections,
  browsers,
  cssInfo,
}) {
  let browserCompatibilityByVersions;
  let propertyAddedVersion;

  userSelections.forEach(userSelect => {
    browsers[userSelect.browser].versionsNotSupport = [];
    browsers[userSelect.browser].versionsPartiallySupport = [];
    browsers[userSelect.browser].versionsSupport = [];

    if (cssData.data[cssProperty]) {
      browserCompatibilityByVersions =
        cssData.data[cssProperty].stats[browsers[userSelect.browser].stat];
    } else if (bcd.css.properties[cssProperty]) {
      const browserName = convertBrowserName(browsers[userSelect.browser].stat);
      const stat =
        bcd.css.properties[cssProperty].__compat.support[browserName];

      propertyAddedVersion = Array.isArray(stat)
        ? parseInt(stat[0].version_added)
        : parseInt(stat.version_added);
    }

    if (browserCompatibilityByVersions) {
      for (const version in browserCompatibilityByVersions) {
        const compatibility = browserCompatibilityByVersions[version];

        if (compatibility === "n") {
          browsers[userSelect.browser].versionsNotSupport.push(version);
        } else if (compatibility.includes("a")) {
          browsers[userSelect.browser].versionsPartiallySupport.push(version);
        } else if (compatibility === "y") {
          browsers[userSelect.browser].versionsSupport.push(version);
        }
      }

      browsers[userSelect.browser].versionsNotSupport.sort((a, b) => a - b);
      browsers[userSelect.browser].versionsPartiallySupport.sort(
        (a, b) => a - b,
      );
      browsers[userSelect.browser].versionsSupport.sort((a, b) => a - b);
    } else if (propertyAddedVersion) {
      browsers[userSelect.browser].version.forEach(versionInfo => {
        if (Number(versionInfo.version) < Number(propertyAddedVersion)) {
          browsers[userSelect.browser].versionsNotSupport.push(
            versionInfo.version,
          );
        } else if (
          Number(versionInfo.version) >= Number(propertyAddedVersion)
        ) {
          browsers[userSelect.browser].versionsSupport.push(
            versionInfo.version,
          );
        }

        browsers[userSelect.browser].versionsNotSupport.sort((a, b) => a - b);
        browsers[userSelect.browser].versionsPartiallySupport.sort(
          (a, b) => a - b,
        );
        browsers[userSelect.browser].versionsSupport.sort((a, b) => a - b);
      });
    }
  });

  function convertBrowserName(browserStat) {
    switch (browserStat) {
      case "samsung":
        return "samsunginternet_android";
      case "and_chr":
        return "chrome_android";
      case "android":
        return "webview_android";
      case "ios_saf":
        return "safari_ios";
      case "and_ff":
        return "firefox_android";
      default:
        return browserStat;
    }
  }

  const propertyInfo = [];

  if (cssInfo.cssProperties) {
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
    <div className="flex flex-col justify-center items-center mb-10">
      <h3 className="text-3xl font-bold">
        <span className="text-red font-bold">{cssProperty}</span> is not
        supported.
      </h3>
      <div>
        <div className="flex flex-col justify-center items-center w-full">
          <div className="flex justify-center items-center mb-10">
            {userSelections.map((selection, index) => (
              <div
                key={index}
                className="flex justify-center items-center w-full mt-10"
              >
                <div className="mx-3">
                  <h4 className="text-2xl font-extrabold">
                    {selection.browser}
                  </h4>
                  <p className="text-xs">Your version "{selection.version}"</p>
                  <div>
                    {browsers[selection.browser].versionsNotSupport.length !==
                      0 && (
                      <div className="flex flex-col justify-center items-center h-12 bg-red text-xl text-white">
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
                      <div className="flex flex-col justify-center items-center h-12 mt-3 bg-yellow text-xl text-white">
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
                      <div className="flex flex-col justify-center items-center h-12 mt-3 bg-green text-xl text-white">
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
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            {propertyInfo.map(info => {
              return (
                <div>
                  <div className="mx-10 my-2 p-4 h-auto bg-red-200">
                    <p className="font-bold">{info.path}</p>
                    <p>
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
                  </div>
                </div>
              );
            })}
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

export default NotSupport;
