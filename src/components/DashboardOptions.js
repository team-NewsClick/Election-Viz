import {
  STATE_UT_DEFAULT_SELECT,
  SEAT_TYPE_OPTIONS,
} from "../constants"
import CustomAllianceModal from "./modals/CustomAllianceModal"
import SwingsModal from "./modals/SwingsModal"

const DashboardOptions = ({
  updateElectionViewType,
  updateCompareElection,
  updateSelectedElection,
  updateSelectedRegion,
  updateGroupType,
  updateSelectedStateUT,
  updateSelectedConstituency,
  homeReset,
  customAlliance,
  handleSwingParams,
  updateSelectedSeatType,
  electionOptions,
  stateUTOptions,
  constituencyOptions,
  regionOptions,
  compareOptions,
  electionViewType,
  groupType,
  selectedElection,
  selectedStateUT,
  selectedConstituency,
  selectedRegion,
  seatType,
  compareElection,
  partyAlliance
}) => {

  const showHideAdvanceOptions = () => {
    const options = document.getElementById("advanceOptionsWeb")
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
      <div className="h-10" />
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
              className="w-40 md:w-64"
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
              className="advance-select w-40 md:w-64"
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
              className="advance-select w-40 md:w-64"
              value={selectedConstituency}
            >
              {constituencyOptions.map((d, index) => (
                <option key={index} value={d}>
                  {d}
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
          id="advanceOptionsWeb"
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
                alt="Close Button"
                className="w-4 h-4"
              />
            </div>
          </div>
          <div className="mx-auto max-w-4xl justify-center">
            <div>
              <div className="flex flex-wrap mx-auto justify-around md:justify-center">
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
              <div className="flex flex-wrap mx-auto justify-around md:justify-center">
                <div
                  onClick={openCustomAllianceModal}
                  className="max-w-sm justify-center flex cursor-pointer w-42 md:w-64 bg-gray-800 text-white rounded border border-gray-500 h-7 m-2 text-sm items-center"
                >
                  Customise Alliances
                </div>
                {selectedStateUT !== STATE_UT_DEFAULT_SELECT && (
                  <div
                    onClick={openSwingModal}
                    className="max-w-sm justify-center flex cursor-pointer w-42 md:w-64 bg-gray-800 text-white rounded border border-gray-500 h-7 m-2 text-sm items-center"
                  >
                    Add Swings
                  </div>
                )}
              </div>
              <div className="flex flex-wrap mx-auto justify-around md:justify-center">
                <div className="md:w-64 inline-block align-text-bottom my-auto">
                  Select an election to compare:
                </div>
                <div>
                  <select
                    name="compareElection"
                    onChange={(e) => updateCompareElection(e.target.value)}
                    id="compareElection"
                    className="advance-select md:w-64"
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
              {/* <div>
                <select
                  name="locality"
                  onChange={(e) => updateSelectedLocality(e.target.value)}
                  id="locality"
                  className="advance-select"
                >
                  {LOCALITY_OPTIONS.map((d, index) => (
                    <option key={index} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  name="community"
                  onChange={(e) => updateSelectedCommunity(e.target.value)}
                  id="community"
                  className="advance-select"
                >
                  {COMMUNITY_OPTIONS.map((d, index) => (
                    <option key={index} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  name="gender"
                  onChange={(e) => updateSelectedGender(e.target.value)}
                  id="gender"
                  className="advance-select"
                >
                  {GENDER_OPTIONS.map((d, index) => (
                    <option key={index} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  name="education"
                  onChange={(e) => updateSelectedEducation(e.target.value)}
                  id="education"
                  className="advance-select"
                >
                  {CRIMINALITY_OPTIONS.map((d, index) => (
                    <option key={index} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  name="experience"
                  onChange={(e) => updateSelectedExperience(e.target.value)}
                  id="experience"
                  className="advance-select"
                >
                  {EXPERIENCE_OPTIONS.map((d, index) => (
                    <option key={index} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  name="criminality"
                  onChange={(e) => updateSelectedCriminality(e.target.value)}
                  id="criminality"
                  className="advance-select"
                >
                  {EDUCATION_OPTIONS.map((d, index) => (
                    <option key={index} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div> */}
            </div>
            <div className="flex my-4 max-w-sm md:max-w-full mx-auto justify-between md:hidden">
              <div>
                <input
                  type="button"
                  value="RESET"
                  className="black-btn"
                  onClick={homeReset}
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
          />
        </div>
    </div>
  )

}

export default DashboardOptions