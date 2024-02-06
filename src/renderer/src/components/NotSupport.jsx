import bcd from "@mdn/browser-compat-data";

function NotSupport({ cssData, cssProperty, userSelections, browsers }) {
  let browserCompatibilityByVersions;
  let propertyAddedVersion;

  userSelections.forEach(userSelect => {
    browsers[userSelect.browser].versionsNotSupport = [];
    browsers[userSelect.browser].versionsPartiallySupport = [];
    browsers[userSelect.browser].versionsSupport = [];

    if (cssData.data[cssProperty]) {
      browserCompatibilityByVersions =
        cssData.data[cssProperty].stats[browsers[userSelect.browser].stat];
    } else {
      const browserName = convertBrowserName(browsers[userSelect.browser].stat);

      propertyAddedVersion =
        bcd.css.properties[cssProperty].__compat.support[browserName]
          .version_added;
    }

    if (browserCompatibilityByVersions) {
      for (const version in browserCompatibilityByVersions) {
        userSelections.forEach(userSelect => {});
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
      browsers[userSelectbrowser].versionsSupport.sort((a, b) => a - b);
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

  return (
    <div className="flex justify-evenly items-center flex-col mt-10 bg-red-5 w-4/5 h-80 scroll-auto">
      <h3 className="font-bold">
        <span className="text-red">text-box-trim</span> on{" "}
        <span className="underline">line 13</span> is not supported.
      </h3>
      <div>
        <div className="flex">
          <div className="flex flex-col">
            {userSelections.map((selection, index) => (
              <div key={index} className="flex justify-end w-full mt-10">
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
              </div>
            ))}
          </div>
          <div className="mx-10 my-2 p-4 h-auto bg-red-200">
            <p>style.css in /User/Desktop/project</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotSupport;
