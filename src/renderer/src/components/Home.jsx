import { useState } from "react";

function Home() {
  const [message, setMessage] = useState({
    show: false,
    text: null,
  });
  const [projectPath, setProjectPath] = useState("");

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
            <button className="absolute bottom-8 p-3 rounded-xl bg-gray text-lg font-bold hover:bg-black hover:text-white">
              Load Project
            </button>
          </>
        )}
      </div>
      <div className="flex justify-evenly m-3 w-full">
        <div className="flex">
          <select
            name="browsers"
            id="browsers"
            className="bg-gray text-sm rounded-lg focus:ring-blue focus:border-blue-500 block py-1 px-3"
          >
            <option value="Chrome">Chrome</option>
          </select>
          <select
            name="versions"
            id="versions"
            className="bg-gray text-sm rounded-lg focus:ring-blue focus:border-blue-500 block py-1 px-3 mx-4"
          >
            <option value="version">124</option>
          </select>
          <button className="px-2 rounded-full bg-gray text-lg font-bold hover:bg-black hover:text-white">
            +
          </button>
        </div>
        <div>
          <input type="radio" name="cssType" id="utility-first-css" />
          <label htmlFor="utility-first-css" className="pr-4 ">
            Utility-first CSS
          </label>
          <input type="radio" name="cssType" id="css-in-js" />
          <label htmlFor="css-in-js">CSS-in-JS</label>
        </div>
      </div>
      <button className="mt-8 px-6 py-2 rounded-xl bg-black text-lg text-white font-bold hover:bg-gray hover:text-black">
        Check!
      </button>
    </main>
  );
}

export default Home;
