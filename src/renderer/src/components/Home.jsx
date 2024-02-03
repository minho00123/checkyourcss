import { useState, useEffect } from "react";

function Home() {
  const [fullData, setFullData] = useState(null);
  const [browsers, setBrowsers] = useState(null);
  const [userSelections, setUserSelections] = useState([
    { browser: "", version: "" },
  ]);
  const [cssFrameworkType, setCssFrameworkType] = useState("");
  const [message, setMessage] = useState({
    show: false,
    text: null,
  });
  const [projectPath, setProjectPath] = useState("");

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
    setMessage({ show: true, text: "Let's Check Your CSS!" });
  }

  function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    const items = event.dataTransfer.items;

    if (items.length === 1 && items[0].webkitGetAsEntry().isDirectory) {
      const fullPath = items[0].getAsFile().path;

      setProjectPath(fullPath);
      setMessage({ show: true, text: "Let's Check Your CSS!" });
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

  return (
    <main className="flex justify-center items-center flex-col mt-10 h-96">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex justify-center items-center flex-col relative w-3/5 h-2/3 border rounded-2xl bg-gray-200 text-6xl font-bold"
      >
        {message.show ? (
          <p className="text-4xl">{message.text}</p>
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
      <div className="flex justify-evenly m-3 w-full">
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
                className="bg-gray text-sm rounded-lg focus:ring-blue focus:border-blue-500 block py-1 px-3"
              >
                <option value="">브라우저</option>
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
                <option value="">버전</option>
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
            id="utility-first-css"
            value="utility-first-css"
            onClick={handleRadioOnClick}
          />
          <label htmlFor="utility-first-css" className="pr-4 ">
            Utility-first CSS
          </label>
          <input
            type="radio"
            name="cssType"
            id="css-in-js"
            value="css-in-js"
            onClick={handleRadioOnClick}
          />
          <label htmlFor="css-in-js">CSS-in-JS</label>
        </form>
      </div>
      <button className="mt-8 px-6 py-2 rounded-xl bg-black text-lg text-white font-bold hover:bg-gray hover:text-black">
        Check!
      </button>
    </main>
  );
}

export default Home;
