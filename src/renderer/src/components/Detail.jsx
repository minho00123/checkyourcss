import NotSupport from "./NotSupport";
import PartialSupport from "./PartialSupport";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
      <button onClick={handleGoBackClick} className="absolute top-40 right-20">
        <FontAwesomeIcon icon={faArrowLeft} className="text-gray-700" />
        <span className="ml-2">Go Back</span>
      </button>
      {isNotSupportCss ? (
        <NotSupport
          cssData={cssData}
          cssProperty={cssInfo}
          userSelections={userSelections}
          browsers={browsers}
        />
      ) : (
        <PartialSupport
          cssData={cssData}
          cssProperty={cssInfo}
          userSelections={userSelections}
          browsers={browsers}
        />
      )}
      <button className="mb-24 px-6 py-2 rounded-xl bg-black text-lg text-white font-bold hover:bg-gray hover:text-black">
        Go to Your Code!
      </button>
    </section>
  );
}

export default Detail;
