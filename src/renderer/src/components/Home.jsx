import { useState, useEffect } from "react";
import bcd from "@mdn/browser-compat-data";
import Result from "./Result";

function Home() {
  const [fullData, setFullData] = useState(null);
  const [browsers, setBrowsers] = useState(null);
  const [userSelections, setUserSelections] = useState([
    { browser: "", version: "" },
  ]);
  const [cssFrameworkType, setCssFrameworkType] = useState("");
  const [message, setMessage] = useState(null);
  const [projectPath, setProjectPath] = useState("");
  const [cssCompatibilityResult, setCssCompatibilityResult] = useState(null);
  const [isAllCompatible, setIsAllCompatible] = useState(true);
  const [cssInfo, setCssInfo] = useState(null);

  useEffect(() => {
    async function getData() {
      try {
        const data = await window.fullCssDataAPI.getFullCssData();
        const agentsData = data.agents;

        setFullData(data);
        setBrowsers({
          Chrome: {
            version: agentsData.chrome.version_list,
            stat: "chrome",
          },
          FireFox: {
            version: agentsData.firefox.version_list,
            stat: "firefox",
          },
          Safari: {
            version: agentsData.safari.version_list,
            stat: "safari",
          },
          Edge: {
            version: agentsData.edge.version_list,
            stat: "edge",
          },
          Opera: {
            version: agentsData.opera.version_list,
            stat: "opera",
          },
          Samsung_Mobile: {
            version: agentsData.samsung.version_list,
            stat: "samasung",
          },
          Chrome_for_android: {
            version: agentsData.and_chr.version_list,
            stat: "and_chr",
          },

          Android: {
            version: agentsData.android.version_list,
            stat: "android",
          },

          Safari_on_iOS: {
            version: agentsData.ios_saf.version_list,
            stat: "ios_saf",
          },

          FireFox_for_android: {
            version: agentsData.and_ff.version_list,
            stat: "and_ff",
          },
        });
      } catch (err) {
        console.error(err);
      }
    }

    getData();
  }, []);

  async function selectFolder() {
    const fullPath = await window.loadProjectAPI.openDirectory();

    setProjectPath(fullPath);

    if (fullPath) {
      setMessage("Let's Check Your CSS!");
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    const items = event.dataTransfer.items;

    if (items.length === 1 && items[0].webkitGetAsEntry().isDirectory) {
      const fullPath = items[0].getAsFile().path;

      setProjectPath(fullPath);
      setMessage("Let's Check Your CSS!");
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  function addSelection() {
    setUserSelections([...userSelections, { browser: "", version: "" }]);
  }

  function updateSelection(index, browserOrVersion, value) {
    const updatedSelections = [...userSelections];

    updatedSelections[index][browserOrVersion] = value;
    setUserSelections(updatedSelections);
  }

  function handleRadioOnClick(event) {
    setCssFrameworkType(event.target.value);
  }

  async function handleCheckClick() {
    if (projectPath && userSelections && cssFrameworkType) {
      const userCssData = await (cssFrameworkType === "tailwindCss"
        ? window.userCssDataAPI.getTailwindCssData(projectPath)
        : window.userCssDataAPI.getStyledComponentsData(projectPath));

      const result = checkCssCompatibility(userCssData);
      setCssInfo(userCssData);
      setCssCompatibilityResult(result);

      result.forEach(property => {
        if (property.compatibility !== "y") {
          setIsAllCompatible(false);
        }
      });
    }
  }

  function checkCssCompatibility(userCssData) {
    const userCss = [];
    const result = [];

    if (userCssData.cssProperties) {
      userCssData.forEach(data => {
        userCss.push(...data.cssProperties);
      });
    } else {
      userCssData.forEach(data => {
        userCss.push(...Object.keys(data.cssMatching));
      });
    }

    userCss.forEach(property => {
      if (property in fullData.data) {
        userSelections.forEach(selection => {
          const stat = browsers[selection.browser].stat;
          const version = selection.version;

          result.push({
            property,
            compatibility: fullData.data[property].stats[stat][version],
          });
        });
      } else if (property in bcd.css.properties) {
        userSelections.forEach(selection => {
          const browserName = convertBrowserName(
            browsers[selection.browser].stat,
          );
          const stat =
            bcd.css.properties[property].__compat.support[browserName];
          const isCompatible = Array.isArray(stat)
            ? parseInt(stat[0].version_added) <= selection.version
            : parseInt(stat.version_added) <= selection.version;

          result.push({
            property,
            compatibility: isCompatible ? "y" : "n",
          });
        });
      }
    });

    return result;
  }

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
    <>
      {!cssCompatibilityResult ? (
        <main className="flex justify-center items-center flex-col h-screen">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="flex mt-10 justify-center items-center flex-col relative w-3/5 h-2/5 border rounded-2xl bg-gray-200 text-6xl font-bold"
          >
            {message ? (
              <p className="text-4xl">{message}</p>
            ) : (
              <>
                <p className="text-lg">Drop your project here.</p>
                <p>+</p>
                <button
                  onClick={selectFolder}
                  className="absolute bottom-8 p-3 rounded-xl bg-gray text-lg font-bold hover:bg-black hover:text-white"
                >
                  Load Project
                </button>
              </>
            )}
          </div>
          <div className="flex justify-evenly overflow-auto max-h-48 m-3 w-full">
            <div>
              {userSelections.map((selection, index) => (
                <div key={index} className="flex mb-3">
                  <select
                    name="browsers"
                    id="browsers"
                    value={selection.browser}
                    onChange={e =>
                      updateSelection(index, "browser", e.target.value)
                    }
                    className="bg-gray text-sm rounded-lg py-1 px-3"
                  >
                    <option value="">Browser</option>
                    {browsers &&
                      Object.keys(browsers).map(browser => (
                        <option key={browser} value={browser}>
                          {browser}
                        </option>
                      ))}
                  </select>
                  <select
                    name="versions"
                    id="versions"
                    value={selection.browser.version}
                    onChange={e =>
                      updateSelection(index, "version", e.target.value)
                    }
                    disabled={!selection.browser}
                    className="bg-gray text-sm rounded-lg focus:ring-blue focus:border-blue-500 block py-1 px-3 mx-4"
                  >
                    <option value="">Version</option>
                    {selection.browser &&
                      browsers[selection.browser].version
                        .slice()
                        .reverse()
                        .map(selectedBrowserVersion => (
                          <option
                            key={selectedBrowserVersion.version}
                            value={selectedBrowserVersion.version}
                          >
                            {selectedBrowserVersion.version}
                          </option>
                        ))}
                  </select>
                  <button
                    onClick={addSelection}
                    className="px-2 rounded-full bg-gray text-lg font-bold hover:bg-black hover:text-white"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
            <form>
              <input
                type="radio"
                name="cssType"
                id="tailwindCss"
                value="tailwindCss"
                onClick={handleRadioOnClick}
              />
              <label htmlFor="tailwindCss" className="pr-4 ">
                Tailwind CSS
              </label>
              <input
                type="radio"
                name="cssType"
                id="styled-components"
                value="styled-components"
                onClick={handleRadioOnClick}
              />
              <label htmlFor="styled-components">styled-components</label>
            </form>
          </div>
          <button
            onClick={handleCheckClick}
            className="mt-8 px-6 py-2 rounded-xl bg-black text-lg text-white font-bold hover:bg-gray hover:text-black"
          >
            Check!
          </button>
        </main>
      ) : (
        <Result
          isPerfect={isAllCompatible}
          cssInfo={cssInfo}
          userSelections={userSelections}
          cssData={fullData}
          browsers={browsers}
          cssCompatibilityResult={cssCompatibilityResult}
        />
      )}
    </>
  );
}

export default Home;
