import { useState, useEffect } from "react"
import axios from "axios"
import { csvParse } from "d3-dsv"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

/**
 * A modal box with customizable alliances
 * @param {Array<Object>} param0 List of parties and their respective alliances
 * @returns {JSX.Element} - A modal box with customizable alliances
 */
const CustomAllianceModal = ({ constituenciesResults, customAlliance }) => {

  const [rowsInit, setRowsInit] = useState([])
  const [resetAlliances, setResetAlliances] = useState(true)
  const [rows, setRows] = useState(rowsInit)
  const [partyAllianceInit, setPartyAllianceInit] = useState([])
  const [customedPartyAlliance, setCustomedPartyAlliance] = useState(partyAllianceInit)

  useEffect(() => {
    axios.get(`/data/csv/party_alliance.csv`).then((response) => {
      const parsedData = csvParse(response.data)
      setPartyAllianceInit(parsedData)
    })
  }, [])

  useEffect(() => {
    setCustomedPartyAlliance(partyAllianceInit)
    let allParties = new Set()
    constituenciesResults.map((d) => {
      allParties.add(d.party)
    })
    let alliances = new Set()
    let alliancePartyData = []
    partyAllianceInit.map((d) => alliances.add(d.ALLIANCE))
    alliances = [...alliances, "OTHERS"]
    alliances.map((d) => {
      alliancePartyData.push({
        alliance: d,
        parties: []
      })
    })
    constituenciesResults.map((d) => {
      let tempAlliance = partyAllianceInit.find((p) => p.PARTY === d.party)
      tempAlliance =  tempAlliance ? tempAlliance.ALLIANCE : "OTHERS"
      let tempAllianceIndex = alliancePartyData.findIndex((e) => e.alliance === tempAlliance)
      let tempPartyIndex = alliancePartyData[tempAllianceIndex].parties.findIndex((e) => e === d.party)
      if(tempPartyIndex < 0) {
        alliancePartyData[tempAllianceIndex].parties.push(d.party)
      }
    })
    setRowsInit(alliancePartyData)
    setRows(alliancePartyData)
  }, [resetAlliances, partyAllianceInit])

  useEffect(() => {
    customAlliance(customedPartyAlliance)
  }, [customedPartyAlliance])

  const openCustomAllianceModal = () => {
    const customAllianceModal = document.getElementById("customAllianceModal")
    customAllianceModal.style.display === "none"
      ? customAllianceModal.style.display = "flex"
      : customAllianceModal.style.display = "none"
  }

  const _ondragEnd = (result) => {
   if(result.destination == undefined) {
    return
   }
   let tempRows = rows
   const tempCustomedPartyAlliance = []
   const srcColIndex = tempRows.findIndex((e) => e.alliance === result.source.droppableId)
   const desColIndex = tempRows.findIndex((e) => e.alliance === result.destination.droppableId)
   tempRows[srcColIndex].parties.splice(result.source.index, 1)
   tempRows[desColIndex].parties.splice(result.destination.index, 0, result.draggableId)
   setRows(tempRows)
   tempRows.map((a) => {
     a.parties.map((p) => {
      tempCustomedPartyAlliance.push({ PARTY: p, ALLIANCE: a.alliance })
     })
   })
   setCustomedPartyAlliance(tempCustomedPartyAlliance)
   customAlliance(partyAllianceInit)
  }

  const _resetPartyAlliance = () => {
    setResetAlliances(resetAlliances ? false : true)
  }

  return (
    <div
      className="flex min-h-screen justify-center bg-white bg-opacity-70"
      style={{ minWidth: "100vw" }}
    >
      <div className="w-5/6 max-h-screen bg-gray-100 border-2 rounded-lg border-gray-200 my-8 p-3">
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
                    <div className="flex min-w-full my-8 rounded-lg border-2 border-gray-300" >
                      <div className="flex flex-wrap justify-center content-center w-1/12 bg-gray-200 font-bold text-xl p-4">
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
                        className="h-auto w-11/12 flex flex-wrap"
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
                                          style={ snapshot.isDragging
                                                  ? {background: "#0D3554", color: 'white', ...provided.draggableProps.style}
                                                  : {background: "white", cursor: "move", ...provided.draggableProps.style}}
                                          className="flex flex-wrap content-center m-2 p-4 max-h-10 select-none w-min border-2 rounded-xl"
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
        <div className="flex my-4 max-w-sm md:max-w-full mx-auto justify-between">
          <div>
            <input
              type="button"
              value="RESET"
              className="black-btn cursor-pointer"
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
