function NotSupport() {
  return (
    <div className="flex justify-evenly items-center flex-col mt-10 bg-red-5 w-4/5 h-80 scroll-auto">
      <h3 className="font-bold">
        <span className="text-red">text-box-trim</span> on{" "}
        <span className="underline">line 13</span> is not supported.
      </h3>
      <div>
        <div className="flex">
          <div>
            <h4 className="text-2xl font-extrabold">Chrome</h4>
            <p className="text-xs">Version</p>
            <div className="flex justify-center items-center h-16 bg-red text-xl text-white">
              4 - 124
            </div>
          </div>
          <div className="ml-10">
            <h4 className="text-2xl font-extrabold">FireFox</h4>
            <p className="text-xs">Version</p>
            <div className="flex justify-center items-center h-16 bg-red text-xl text-white">
              2 - 125
            </div>
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
