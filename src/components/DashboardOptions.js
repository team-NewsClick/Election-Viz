import { ALL_STATE_UT, SEAT_TYPE_OPTIONS, SELECT_STATE_UT } from "../constants"
import { CustomAllianceModal, SwingsModal } from "./modals/index"

/**
 * Control setting options of Dashboard
 * @component
 * @param {Function} updateElectionViewType Function to update electionViewType on parent component
 * @param {Function} updateCompareElection Function to update compareElection on parent component
 * @param {Function} updateSelectedElection Function to update selectedElection on parent component
 * @param {Function} updateSelectedRegion Function to update selectedRegion on parent component
 * @param {Function} updateGroupType Function to update groupType on parent component
 * @param {Function} updateSelectedStateUT Function to update selectedStateUT on parent component
 * @param {Function} updateSelectedConstituency Function to update selectedConstituency on parent component
 * @param {Function} doAdvanceReset Functoin to reset advance options values
 * @param {Function} customAlliance Function to update partyAlliance on parent component
 * @param {Function} handleColorPartyAlliance Function to update colorPartyAlliance on parent component
 * @param {Function} handleSwingParams Function to update swingParams on parent component
 * @param {Function} updateSelectedSeatType Function to update selectedSeatType on parent component
 * @param {Array<Object>} electionOptions List of elections to be selected
 * @param {Array<String>} stateUTOptions List of state/UT options to be selected
 * @param {Array<Object>} constituencyOptions List of constituencies and their code to be selected
 * @param {Array<String>} regionOptions List of regio option to be selected
 * @param {Array<Object>} compareOptions List of comparable elections to be selected
 * @param {String} electionViewType assembly/general
 * @param {Object} selectedElection Selected election: {type: "assembly"/"general", year: "year"}
 * @param {String} selectedStateUT Name of selected state/UT
 * @param {String} selectedConstituency Name of selected constituency
 * @param {String} selectedRegion Name of selected region in a state/UT
 * @param {String} seatType Selected seat type: All Seats/Reserve/Unreserved
 * @param {Object} compareElection Selected election to be compared with :{type: "assembly"/"general", year: "year"}
 * @param {Array<Object>} partyAlliance List of parties and their respective alliances
 * @param {Boolean} advanceReset Reset advance options values to default when its value toggle
 * @returns {JSX.Element} Control setting options of Dashboard
 */
const DashboardOptions = ({
  updateElectionViewType,
  updateCompareElection,
  updateSelectedElection,
  updateSelectedRegion,
  updateGroupType,
  updateSelectedStateUT,
  updateSelectedConstituency,
  doAdvanceReset,
  customAlliance,
  handleColorPartyAlliance,
  handleSwingParams,
  updateSelectedSeatType,
  electionOptions,
  stateUTOptions,
  constituencyOptions,
  regionOptions,
  compareOptions,
  electionViewType,
  selectedElection,
  selectedStateUT,
  selectedConstituency,
  selectedRegion,
  seatType,
  compareElection,
  partyAlliance,
  advanceReset
}) => {
  const showHideAdvanceOptions = () => {
    const options = document.getElementById("advanceOptionsDashboard")
    const btnText = document.getElementById("showHideAdvance-btn")
    const btnIcon = document.getElementById("showHideAdvance-btn-icon")
    options.style.display === "none"
      ? ((options.style.display = "block"),
        (btnText.innerHTML = "Hide Advance Options"),
        (btnIcon.style.transform = "rotate(180deg)"))
      : ((options.style.display = "none"),
        (btnText.innerHTML = "Show Advance Options"),
        (btnIcon.style.transform = "rotate(0deg)"))
  }

  const openCustomAllianceModal = () => {
    const customAllianceModal = document.getElementById("customAllianceModal")
    customAllianceModal.style.display === "none"
      ? (customAllianceModal.style.display = "flex")
      : (customAllianceModal.style.display = "none")
  }

  const openSwingModal = () => {
    const swingModal = document.getElementById("swingModal")
    swingModal.style.display === "none"
      ? (swingModal.style.display = "flex")
      : (swingModal.style.display = "none")
  }

  return (
    <div>
      <div className="flex flex-wrap justify-center mx-auto">
        <div className="radio-toolbar md:mx-2 my-2">
          <input
            type="radio"
            id="general"
            name="election"
            value="general"
            onChange={(e) => updateElectionViewType(e.currentTarget.value)}
          />
          <label htmlFor="general">General</label>
          <input
            type="radio"
            id="assembly"
            name="election"
            value="assembly"
            defaultChecked
            onChange={(e) => updateElectionViewType(e.currentTarget.value)}
          />
          <label htmlFor="assembly">Assembly</label>
        </div>
        <div className="radio-toolbar md:mx-2 my-2">
          <input
            type="radio"
            id="alliance"
            name="group"
            value="alliance"
            onChange={(e) => updateGroupType(e.currentTarget.value)}
          />
          <label htmlFor="alliance">Alliance</label>
          <input
            type="radio"
            id="party"
            name="group"
            value="party"
            defaultChecked
            onChange={(e) => updateGroupType(e.currentTarget.value)}
          />
          <label htmlFor="party">Party</label>
        </div>
        <div>
          <select
            name="year"
            onChange={(e) => updateSelectedElection(e.target.value)}
            id="year"
            className="w-80 md:w-64"
            value={JSON.stringify(selectedElection)}
          >
            {electionOptions.map((d, index) => (
              <option key={index} value={JSON.stringify(d.value)}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-wrap justify-center mx-auto">
        <div>
          <select
            name="state-ut"
            onChange={(e) => updateSelectedStateUT(e.target.value)}
            id="state-ut"
            className="advance-select w-36 md:w-64"
            value={selectedStateUT}
          >
            {stateUTOptions.map((d, index) => (
              <option key={index} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            name="constituency"
            onChange={(e) => updateSelectedConstituency(e.target.value)}
            id="constituency"
            className="advance-select w-36 md:w-64"
            value={selectedConstituency}
          >
            {constituencyOptions.map((d, index) => (
              <option key={index} value={d.code}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div
          onClick={showHideAdvanceOptions}
          className="max-w-sm justify-center flex cursor-pointer w-42 md:w-64 bg-gray-800 text-white rounded border border-gray-500 h-7 m-2 text-sm"
        >
          <div id="showHideAdvance-btn" className="my-auto mx-3">
            Show Advance Options
          </div>
          <div>
            <img
              id="showHideAdvance-btn-icon"
              src="../img/down-arrow.svg"
              alt="Show Advance Options"
              className="w-3 h-3 md:ml-14 m-1.5"
            />
          </div>
        </div>
      </div>
      <div
        id="advanceOptionsDashboard"
        style={{ display: "none", zIndex: "2" }}
        className="bg-gray-100 h-full md:h-auto md:relative inset-0 top-0 md:top-auto fixed"
      >
        <div className="h-0.5 bg-gray-300 w-full max-w-4xl my-3.5 mx-auto hidden md:block">
          &nbsp;
        </div>
        <div className="flex justify-center my-8 md:hidden">
          <div className="font-bold">Advance Options</div>
          <div
            className="absolute top-8 right-6 cursor-pointer"
            onClick={showHideAdvanceOptions}
          >
            <img
              id="showHideAdvance-btn-icon"
              src="../img/close-btn.svg"
              alt="Close Advance Options"
              className="w-4 h-4"
            />
          </div>
        </div>
        <div className="mx-auto max-w-4xl justify-center">
          <div>
            <div className="flex flex-wrap mx-auto justify-around md:justify-center">
              {electionViewType === "assembly" && (
                <div>
                  <select
                    name="region"
                    onChange={(e) => updateSelectedRegion(e.target.value)}
                    id="region"
                    className="advance-select md:w-64"
                    value={selectedRegion}
                  >
                    {regionOptions.map((d, index) => (
                      <option key={index} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <select
                  name="seatType"
                  onChange={(e) => updateSelectedSeatType(e.target.value)}
                  id="seatType"
                  className="advance-select md:w-64"
                  value={seatType}
                >
                  {SEAT_TYPE_OPTIONS.map((d, index) => (
                    <option key={index} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {selectedStateUT !== ALL_STATE_UT &&
              selectedStateUT !== SELECT_STATE_UT && (
                <div className="flex flex-wrap mx-auto justify-around md:justify-center">
                  <div
                    onClick={openCustomAllianceModal}
                    className="max-w-sm justify-center flex cursor-pointer w-40 md:w-64 bg-gray-800 text-white rounded border border-gray-500 h-7 m-2 text-sm items-center"
                  >
                    Customise Alliances
                  </div>
                  <div
                    onClick={openSwingModal}
                    className="max-w-sm justify-center flex cursor-pointer w-40 md:w-64 bg-gray-800 text-white rounded border border-gray-500 h-7 m-2 text-sm items-center"
                  >
                    Add Swings
                  </div>
                </div>
              )}
            <div className="flex flex-wrap mx-auto justify-around md:justify-center">
              <div className="flex flex-wrap">
                <div className="inline-block align-text-bottom my-auto text-right">
                  Compare with:
                </div>
                <div>
                  <select
                    name="compareElection"
                    onChange={(e) => updateCompareElection(e.target.value)}
                    id="compareElection"
                    className="advance-select w-60 md:w-64"
                    value={JSON.stringify(compareElection)}
                  >
                    {compareOptions.map((d, index) => (
                      <option key={index} value={JSON.stringify(d.value)}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="md:ml-14 hidden md:block">
                <input
                  type="button"
                  value="RESET"
                  className="max-w-sm justify-center flex cursor-pointer px-5 bg-gray-800 text-white rounded border border-gray-500 h-7 m-2 text-sm items-center"
                  onClick={doAdvanceReset}
                />
              </div>
            </div>
          </div>
          <div className="flex my-4 max-w-sm md:max-w-full mx-auto justify-between md:hidden">
            <div>
              <input
                type="button"
                value="RESET"
                className="black-btn"
                onClick={doAdvanceReset}
              />
            </div>
            <div>
              <input
                type="button"
                value="OK"
                onClick={showHideAdvanceOptions}
                className="black-btn"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        id="customAllianceModal"
        style={{ display: "none", zIndex: "2" }}
        className="fixed left-0 top-0 bottom-0 overflow-y-scroll"
      >
        <CustomAllianceModal
          selectedElection={selectedElection}
          selectedStateUT={selectedStateUT}
          electionViewType={electionViewType}
          customAlliance={customAlliance}
          handleColorPartyAlliance={handleColorPartyAlliance}
          advanceReset={advanceReset}
        />
      </div>
      <div
        id="swingModal"
        className="fixed left-0 top-0 bottom-0 overflow-y-scroll"
        style={{ display: "none", zIndex: "2" }}
      >
        <SwingsModal
          selectedElection={selectedElection}
          handleSwingParams={handleSwingParams}
          selectedStateUT={selectedStateUT}
          partyAlliance={partyAlliance}
          advanceReset={advanceReset}
        />
      </div>
    </div>
  )
}

export default DashboardOptions
