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
    </section>
  );
}

export default Detail;
