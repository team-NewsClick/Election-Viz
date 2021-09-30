import { useState, useEffect } from "react"
import axios from "axios"
import { csvParse } from "d3-dsv"
import {
  getWinningParties,
  getPartyAlliance,
  getColorPartyAlliance,
  getPartiesAlliancesFromRows
} from "../../helpers/customAlliance"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import {
  FIRST_SELECT_STATEUT,
  PARTY_ALLIANCE_COLORS,
  CSV_PATH,
  SELECT_ELECTION,
  SELECT_STATE_UT,
  ALL_STATE_UT
} from "../../constants"
import { getElectionURL } from "../../helpers/utils"

/**
 * A modal box with customizable alliances
 * @component
 * @param {Object} selectedElection {type: "assembly"/"general", year: "year"}
 * @param {String} selectedStateUT Name of selected State/UT
 * @param {String} electionViewType Selected election view type
 * @param {Function} customAlliance Funciton to update "customed Alliance" on parent component
 * @param {Function} handleColorPartyAlliance Function to update color of respective parties & alliances on parent component
 * @param {Boolean} advanceReset Change in advanceReset inititates reseting of Custom Alliances to default
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
    if (selectedElection === SELECT_ELECTION) {
      setYearData([])
    } else {
      const electionType = selectedElection.type
      const year = selectedElection.year
      let electionURL = getElectionURL(electionViewType, electionType, year)
      axios
        .get(electionURL)
        .then((response) => {
          const parsedData = csvParse(response.data)
          setYearData(parsedData)
        })
        .catch((e) => setYearData([]))
      axios.get(`${CSV_PATH}/party_alliance.csv`).then((response) => {
        const parsedData = csvParse(response.data)
        setDefaultPartyAlliance(parsedData)
        customAlliance(parsedData)
        handleColorPartyAlliance(PARTY_ALLIANCE_COLORS)
      })
    }
  }, [selectedStateUT, electionViewType, advanceReset])

  useEffect(() => {
    if (defaultPartyAlliance.length !== 0) {
      const parties = getWinningParties(
        yearData,
        selectedStateUT,
        electionViewType
      )
      const tempPartyAlliance = getPartyAlliance(parties, defaultPartyAlliance)
      setRows(tempPartyAlliance)
      const tempCustomedPartyAlliance =
        getPartiesAlliancesFromRows(tempPartyAlliance)
      customAlliance(tempCustomedPartyAlliance)
      const colorPartyAlliance = getColorPartyAlliance(rows)
      handleColorPartyAlliance(colorPartyAlliance)
    }
  }, [selectedStateUT, defaultPartyAlliance])

  useEffect(() => {
    let tempParties,
      oldUnalignedParties = [],
      newUnalignedParties = new Set()
    if (selectedStateUT !== SELECT_STATE_UT) {
      const electionType = selectedElection.type
      const year = selectedElection.year
      let electionURL = getElectionURL(electionViewType, electionType, year)
      axios
        .get(electionURL)
        .then((response) => {
          const parsedData = csvParse(response.data)
          setYearData(parsedData)
          tempParties = getWinningParties(
            parsedData,
            selectedStateUT,
            electionViewType
          )
          rows.map(
            (d) =>
              d.alliance === "Unaligned" &&
              d.parties.map((p) => oldUnalignedParties.push(p))
          )
          tempParties.map((p) => {
            let presentInOldRow = false
            rows.map((row) => {
              if (row.alliance !== "Unaligned") {
                const tempIndex = row.parties.findIndex((d) => d === p)
                if (tempIndex >= 0) presentInOldRow = true
              }
            })
            if (!presentInOldRow) newUnalignedParties.add(p)
          })
          oldUnalignedParties.map((d) => newUnalignedParties.add(d))
          newUnalignedParties = [...newUnalignedParties]
          const tempNewPartyAlliance = getPartyAlliance(
            newUnalignedParties,
            defaultPartyAlliance
          )
          const oldRows = rows.filter((d) => d.alliance !== "Unaligned")
          const newRows = [...oldRows]
          tempNewPartyAlliance.map((row) => {
            const tempIndex = oldRows.findIndex(
              (o) => o.alliance === row.alliance
            )
            if (tempIndex >= 0) {
              const newRowParties = new Set()
              row.parties.map((p) => newRowParties.add(p))
              o.parties.map((p) => newRowParties.add(p))
              newRowParties = [...newRowParties]
              newRows.push({
                alliance: row.alliancelliance,
                parties: newRowParties
              })
            } else {
              newRows.push(row)
            }
          })
          setRows(newRows)
          const tempCustomedPartyAlliance = getPartiesAlliancesFromRows(newRows)
          customAlliance(tempCustomedPartyAlliance)
          const colorPartyAlliance = getColorPartyAlliance(newRows)
          handleColorPartyAlliance(colorPartyAlliance)
        })
        .catch((e) => setYearData([]))
    }
  }, [selectedElection])

  useEffect(() => {
    electionViewType === "general" && _resetPartyAlliance()
  }, [selectedElection])

  useEffect(() => {
    _resetPartyAlliance()
  }, [selectedStateUT, advanceReset])

  const _addNewAlliance = (v) => {
    const tempAlliance = document.getElementById("new-alliance").value.trim()
    const allianceExist =
      rows.findIndex((d) => d.alliance === tempAlliance) >= 0 ? true : false
    const unalignedIndex = rows.findIndex((d) => d.alliance === "Unaligned")
    if (newAllianceCount < 3 && tempAlliance.length !== 0 && !allianceExist) {
      const tempRows = rows
      setNewAllianceCount((prevNewAllianceCount) => prevNewAllianceCount + 1)
      unalignedIndex > -1
        ? tempRows.splice(unalignedIndex, 0, {
            alliance: tempAlliance,
            parties: []
          })
        : tempRows.push({ alliance: tempAlliance, parties: [] })
      setRows(tempRows)
      document.getElementById("new-alliance").value = ""
    }
  }

  const openCustomAllianceModal = () => {
    const customAllianceModal = document.getElementById("customAllianceModal")
    customAllianceModal.style.display === "none"
      ? (customAllianceModal.style.display = "flex")
      : (customAllianceModal.style.display = "none")
    const tempCustomedPartyAlliance = getPartiesAlliancesFromRows(rows)
    customAlliance(tempCustomedPartyAlliance)
    const colorPartyAlliance = getColorPartyAlliance(rows)
    handleColorPartyAlliance(colorPartyAlliance)
  }

  const _ondragEnd = (result) => {
    if (result.destination == undefined) return
    let tempRows = rows
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

  if (
    resetAlliances === true &&
    selectedElection !== FIRST_SELECT_STATEUT &&
    selectedStateUT !== SELECT_STATE_UT
  ) {
    if (selectedStateUT === ALL_STATE_UT || rows.length === 0) {
      axios
        .get(
          `${CSV_PATH}/${electionViewType}/${selectedElection.type}_${selectedElection.year}.csv`
        )
        .then((response) => {
          const parsedData = csvParse(response.data)
          if (defaultPartyAlliance.length !== 0) {
            const parties = getWinningParties(
              parsedData,
              selectedStateUT,
              electionViewType
            )
            const tempPartyAlliance = getPartyAlliance(
              parties,
              defaultPartyAlliance
            )
            const tempCustomedPartyAlliance =
              getPartiesAlliancesFromRows(tempPartyAlliance)
            setRows(tempPartyAlliance)
            customAlliance(tempCustomedPartyAlliance)
            const colorPartyAlliance = getColorPartyAlliance(tempPartyAlliance)
            handleColorPartyAlliance(colorPartyAlliance)
          }
        })
        .catch((e) => setYearData([]))
    } else {
      let tempParties = []
      rows.map((d) => d.parties.map((p) => tempParties.push(p)))
      const tempPartyAlliance = getPartyAlliance(
        tempParties,
        defaultPartyAlliance
      )
      setRows(tempPartyAlliance)
      const tempCustomedPartyAlliance =
        getPartiesAlliancesFromRows(tempPartyAlliance)
      const colorPartyAlliance = getColorPartyAlliance(tempPartyAlliance)
      customAlliance(tempCustomedPartyAlliance)
      handleColorPartyAlliance(colorPartyAlliance)
    }
    setResetAlliances(false)
  }

  return (
    <div
      className="flex h-full min-h-screen justify-center bg-white bg-opacity-70 overscroll-contain overflow-scroll"
      style={{ minWidth: "100vw", height: "fit-content" }}
    >
      <div className="w-11/12 md:w-5/6 bg-gray-100 border-2 rounded-lg border-gray-200 my-8 p-3">
        <div>
          <div
            className="flex justify-end cursor-pointer"
            onClick={openCustomAllianceModal}
          >
            <img
              id="openCustomAllianceModal-btn-icon"
              src="../img/close-btn.svg"
              alt="Close custom alliance modal box"
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
