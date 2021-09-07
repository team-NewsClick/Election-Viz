import { useState, useEffect } from "react"
import axios from "axios"
import { csvParse } from "d3-dsv"
import {
  getWinningParties,
  getPartyAlliance,
  getColorPartyAlliance
} from "../../helpers/customAlliance"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import {
  FIRST_SELECT_STATEUT,
  LIVE_ELECTION,
  UPCOMING_ELECTION,
  UPCOMING_ELECTION_YEAR,
  UPCOMING_ELECTION_TYPE,
  PARTY_ALLIANCE_COLORS
} from "../../constants"
/**
 * A modal box with customizable alliances
 * @param {Array<Object>} param0 Election result of a constituency
 * @param {Function} param1 Funciton to update "customed Alliance" on parent component
 * @param {Array<Object>} param2 List of Alliances and their respective swings
 * @param {String} param3 Selected Year
 * @param {String} param3 Name of selected State/UT
 * @returns {JSX.Element} - A modal box with customizable alliances
 */
const CustomAllianceModal = ({
  selectedElection,
  selectedStateUT,
  electionViewType,
  customAlliance,
  handleColorPartyAlliance,
  advanceReset
}) => {
  const [yearData, setYearData] = useState([])
  const [rows, setRows] = useState([])
  const [defaultPartyAlliance, setDefaultPartyAlliance] = useState([])
  const [newAllianceCount, setNewAllianceCount] = useState(0)
  const [resetAlliances, setResetAlliances] = useState(true)

  useEffect(() => {
    let URL
    if(selectedElection === LIVE_ELECTION) {
      URL = `${process.env.LIVE_ELECTION}`
    } else if(selectedElection.year === UPCOMING_ELECTION) {
      URL = `/data/csv/${UPCOMING_ELECTION_TYPE}_${parseInt(UPCOMING_ELECTION_YEAR)}.csv`
    } else {
      const electionType = selectedElection.type
      const year = selectedElection.year
      URL = `/data/csv/${electionType}_${year}.csv`
    }
    axios
      .get(URL)
      .then((response) => {
        const parsedData = csvParse(response.data)
        setYearData(parsedData)
      })
      .catch((e) => setYearData([]))
    axios.get(`/data/csv/party_alliance.csv`).then((response) => {
      const parsedData = csvParse(response.data)
      setDefaultPartyAlliance(parsedData)
      customAlliance(parsedData)
      handleColorPartyAlliance(PARTY_ALLIANCE_COLORS)
    })
  }, [selectedStateUT, selectedElection, electionViewType, advanceReset])

  useEffect(() => {
    if (defaultPartyAlliance.length !== 0) {
      const parties = getWinningParties(
        yearData,
        selectedStateUT,
        electionViewType
      )
      let tempPartyAlliance = getPartyAlliance(parties, defaultPartyAlliance)
      tempPartyAlliance = tempPartyAlliance.filter((d) => d.parties.length !== 0)
      setRows(tempPartyAlliance)
      let tempCustomedPartyAlliance = []
      rows.map((a) => {
        a.parties.map((p) => {
          tempCustomedPartyAlliance.push({ PARTY: p, ALLIANCE: a.alliance })
        })
      })
      customAlliance(tempCustomedPartyAlliance)
      const colorPartyAlliance = getColorPartyAlliance(rows)
      handleColorPartyAlliance(colorPartyAlliance)
    }
  }, [selectedElection, selectedStateUT, yearData, defaultPartyAlliance])

  useEffect(() => {
    _resetPartyAlliance()
  }, [selectedElection, selectedStateUT, advanceReset])

  const _addNewAlliance = (v) => {
    const tempAlliance = document.getElementById("new-alliance").value.trim()
    const allianceExist =
      rows.findIndex((d) => d.alliance === tempAlliance) >= 0 ? true : false
    if (newAllianceCount < 3 && tempAlliance.length !== 0 && !allianceExist) {
      setNewAllianceCount((prevNewAllianceCount) => prevNewAllianceCount + 1)
      const tempRows = [...rows, { alliance: tempAlliance, parties: [] }]
      setRows(tempRows)
      document.getElementById("new-alliance").value = ""
    }
  }

  const openCustomAllianceModal = () => {
    const customAllianceModal = document.getElementById("customAllianceModal")
    customAllianceModal.style.display === "none"
      ? (customAllianceModal.style.display = "flex")
      : (customAllianceModal.style.display = "none")
    let tempCustomedPartyAlliance = []
    rows.map((a) => {
      a.parties.map((p) => {
        tempCustomedPartyAlliance.push({ PARTY: p, ALLIANCE: a.alliance })
      })
    })
    customAlliance(tempCustomedPartyAlliance)
    const colorPartyAlliance = getColorPartyAlliance(rows)
    handleColorPartyAlliance(colorPartyAlliance)
  }

  const _ondragEnd = (result) => {
    if (result.destination == undefined) {
      return
    }
    let tempRows = rows
    const tempCustomedPartyAlliance = []
    const srcColIndex = tempRows.findIndex(
      (e) => e.alliance === result.source.droppableId
    )
    const desColIndex = tempRows.findIndex(
      (e) => e.alliance === result.destination.droppableId
    )
    tempRows[srcColIndex].parties.splice(result.source.index, 1)
    tempRows[desColIndex].parties.splice(
      result.destination.index,
      0,
      result.draggableId
    )
    setRows(tempRows)
  }

  const _resetPartyAlliance = () => {
    setResetAlliances(true)
    setNewAllianceCount(0)
  }

  if (resetAlliances === true && selectedElection !== FIRST_SELECT_STATEUT) {
    let URL
    if(selectedElection === LIVE_ELECTION) {
      URL = `${process.env.LIVE_ELECTION}`
    } else if(selectedElection.year === UPCOMING_ELECTION) {
      URL = `/data/csv/${UPCOMING_ELECTION_TYPE}_${parseInt(UPCOMING_ELECTION_YEAR)}.csv`
    } else {
      const electionType = selectedElection.type
      const year = selectedElection.year
      URL = `/data/csv/${electionType}_${year}.csv`
    }
    axios
      .get(URL)
      .then((response) => {
        const parsedData = csvParse(response.data)
        setYearData(parsedData)
      })
      .catch((e) => setYearData([]))
      setResetAlliances(false)  }

  return (
    <div
      className="flex md:min-h-screen justify-center bg-white bg-opacity-70 overscroll-contain overflow-auto"
      style={{ minWidth: "100vw", height: "fit-content" }}
    >
      <div className="w-11/12 md:w-5/6 md:max-h-screen bg-gray-100 border-2 rounded-lg border-gray-200 my-8 p-3">
        <div>
          <div
            className="flex justify-end cursor-pointer"
            onClick={openCustomAllianceModal}
          >
            <img
              id="openCustomAllianceModal-btn-icon"
              src="../img/close-btn.svg"
              alt="Close Button"
              className="w-4 h-4"
            />
          </div>
          <div className="flex justify-center font-bold text-2xl">
            Customise Alliances
          </div>
        </div>
        <DragDropContext onDragEnd={(result) => _ondragEnd(result)}>
          {rows.map((d) => {
            return (
              <Droppable
                droppableId={d.alliance}
                key={d.alliance}
                direction="horizontal"
              >
                {(provided, snapshot) => {
                  return (
                    <div className="flex min-w-full my-8 rounded-lg border-2 border-gray-300">
                      <div className="flex flex-wrap justify-center content-center w-2/12 lg:w-1/12 bg-gray-200 font-bold text-base md:text-xl p-4">
                        {d.alliance}
                      </div>
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={
                          snapshot.isDraggingOver
                            ? { background: "#f6f6f6" }
                            : { background: "white" }
                        }
                        className="h-auto w-10/12 lg:w-11/12 flex flex-wrap"
                      >
                        {d.parties.map((e, index) => {
                          return (
                            <Draggable key={e} draggableId={e} index={index}>
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={
                                      snapshot.isDragging
                                        ? {
                                            background: "#0D3554",
                                            color: "white",
                                            ...provided.draggableProps.style
                                          }
                                        : {
                                            background: "white",
                                            cursor: "move",
                                            ...provided.draggableProps.style
                                          }
                                    }
                                    className="flex flex-wrap content-center m-2 p-4 max-h-10 select-none border-2 rounded-xl text-base"
                                  >
                                    {e}
                                  </div>
                                )
                              }}
                            </Draggable>
                          )
                        })}
                        {provided.placeholder}
                      </div>
                    </div>
                  )
                }}
              </Droppable>
            )
          })}
        </DragDropContext>
        <div>
          <div className="flex justify-center mt-10">
            <input
              type="text"
              placeholder="Enter New Alliance Name"
              id="new-alliance"
              name="new-alliance"
              className="border-2 border-gray-500 rounded w-auto px-1 mx-1.5"
            />
            <input
              type="button"
              value="Add New Alliance"
              onClick={() => _addNewAlliance()}
              className="black-btn cursor-pointer w-auto px-4 m-0 mx-1.5"
            />
          </div>
          <div className="flex justify-center">
            New alliance name cannot be empty or duplicate.
          </div>
        </div>

        <div className="flex my-4 max-w-sm md:max-w-full mx-auto justify-between">
          <div>
            <input
              type="button"
              value="RESET"
              className="black-btn cursor-pointer w-full"
              onClick={_resetPartyAlliance}
            />
          </div>
          <div>
            <input
              type="button"
              value="OK"
              onClick={openCustomAllianceModal}
              className="black-btn cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomAllianceModal
