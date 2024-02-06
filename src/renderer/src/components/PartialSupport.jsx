function PartialSupport({ cssProperty }) {
  return (
    <div className="flex justify-evenly items-center flex-col mt-10 bg-yellow-100 w-5/6 h-80">
      <h3 className="font-bold">
        <span className="text-yellow">{cssProperty}</span> on{" "}
        <span className="underline">line 13</span> is partially supported.
      </h3>
      <div>
        <div className="flex">
          <div className="mx-3">
            <h4 className="text-2xl font-extrabold">Chrome</h4>
            <p className="text-xs">Version</p>
            <div>
              <div className="flex justify-center items-center h-12 bg-red text-xl text-white">
                4
              </div>
              <div className="flex justify-center items-center h-12 mt-3 bg-yellow text-xl text-white">
                5 - 124
              </div>
            </div>
          </div>
          <div className="mx-5 my-2 p-4 h-auto bg-yellow-200">
            <h5 className="font-bold">Description</h5>
            <p className="bg-yellow-300 mb-3">
              WebKit implements something similar with a different name
              `-webkit-font-smoothing` and different values: `none`,
              `antialiased` and `subpixel-antialiased`.
            </p>
            <h5 className="font-bold">Example</h5>
          </div>
          <div className="ml-5">
            <h4 className="text-2xl font-extrabold">FireFox</h4>
            <p className="text-xs">Version</p>
            <div className="flex justify-center items-center h-12 bg-red text-xl text-white">
              2 - 24
            </div>
            <div className="flex justify-center items-center h-12 mt-3 bg-yellow text-xl text-white">
              25 - 124
            </div>
          </div>
          <div className="mx-5 my-2 p-4 h-auto bg-yellow-200">
            <h5 className="font-bold">Description</h5>
            <p className="bg-yellow-300 mb-3">
              Firefox implements something similar with a different name
              `-moz-osx-font-smoothing` and different values: `auto`, `inherit`,
              `unset`, `grayscale`.
            </p>
            <h5 className="font-bold">Example</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartialSupport;
