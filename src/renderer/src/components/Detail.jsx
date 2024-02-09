import NotSupport from "./NotSupport";
import PartialSupport from "./PartialSupport";

function Detail({
  cssData,
  cssInfo,
  isNotSupportCss,
  userSelections,
  browsers,
  setIsDetailClicked,
}) {
  function handleGoBackClick() {
    setIsDetailClicked(false);
  }

  return (
    <section className="flex justify-center items-center flex-col h-screen mt-10">
      <button onClick={handleGoBackClick}>go back</button>
      {isNotSupportCss ? (
        <NotSupport
          cssData={cssData}
          cssProperty={cssInfo}
          userSelections={userSelections}
          browsers={browsers}
        />
      ) : (
        <PartialSupport cssProperty={cssInfo} />
      )}
      <button className="mt-14 px-6 py-2 rounded-xl bg-black text-lg text-white font-bold hover:bg-white hover:text-black hover:border">
        Go to Your Code!
      </button>
    </section>
  );
}

export default Detail;
