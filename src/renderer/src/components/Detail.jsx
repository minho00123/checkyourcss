import NotSupport from "./NotSupport";
import PartialSupport from "./PartialSupport";

function Detail({
  cssData,
  cssInfo,
  isNotSupportCss,
  userSelections,
  browsers,
}) {
  return (
    <section className="flex justify-center items-center flex-col h-screen mt-10">
      {isNotSupportCss ? (
        <NotSupport />
      ) : (
        <PartialSupport
          cssData={cssData}
          cssProperty={cssInfo}
          userSelections={userSelections}
          browsers={browsers}
        />
      )}
      <button className="mt-14 px-6 py-2 rounded-xl bg-black text-lg text-white font-bold hover:bg-white hover:text-black hover:border">
        Go to Your Code!
      </button>
    </section>
  );
}

export default Detail;
