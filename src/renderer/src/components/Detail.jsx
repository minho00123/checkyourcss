import NotSupport from "./NotSupport";
import PartialSupport from "./PartialSupport";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function Detail({
  cssData,
  clickedValue,
  isNotSupportCss,
  browsers,
  userSelections,
  setIsDetailClicked,
  cssInfo,
}) {
  function handleGoBackClick() {
    setIsDetailClicked(false);
  }

  return (
    <section className="flex justify-center items-center flex-col mt-40">
      <button onClick={handleGoBackClick} className="absolute top-40 right-20">
        <FontAwesomeIcon icon={faArrowLeft} className="text-gray-700" />
        <span className="ml-2">Go Back</span>
      </button>
      {isNotSupportCss ? (
        <NotSupport
          cssData={cssData}
          cssProperty={clickedValue}
          userSelections={userSelections}
          browsers={browsers}
          cssInfo={cssInfo}
        />
      ) : (
        <PartialSupport
          cssData={cssData}
          cssProperty={clickedValue}
          userSelections={userSelections}
          browsers={browsers}
          cssInfo={cssInfo}
        />
      )}
      <button className="mb-24 px-6 py-2 rounded-xl bg-black text-lg text-white font-bold hover:bg-gray hover:text-black">
        Go to Your Code!
      </button>
    </section>
  );
}

export default Detail;
