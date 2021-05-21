import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

const CustomAllianceModal = ({ partyAlliance }) => {

  const [rows, setRows] = useState([])
  const [customedPartyAlliance, setCustomedPartyAlliance] = useState(partyAlliance)

  useEffect(() => {
    setRows(alliancePartyData)
  }, [])

  console.log("customedPartyAlliance: ", customedPartyAlliance)

  let alliances = new Set()
  let alliancePartyData = []
  partyAlliance.map((d) => alliances.add(d.ALLIANCE))
  alliances = [...alliances]
  alliances.map((d) => {
    const parties = []
    partyAlliance.map((a) => {
      if (a.ALLIANCE === d) {
        parties.push(a.PARTY)
      }
    })
    alliancePartyData.push({
      alliance: d,
      parties,
    })
  })

  const openCustomAllianceModal = () => {
    const customAllianceModal = document.getElementById("customAllianceModal")
    customAllianceModal.style.display === "none"
      ? (customAllianceModal.style.display = "flex")
      : (customAllianceModal.style.display = "none")
  }

  const _ondragEnd = (result) => {
   if(result.destination == undefined) {
    return
   }
   let tempCol = rows
   const tempCustomedPartyAlliance = []
   const srcColIndex = tempCol.findIndex((e) => e.alliance === result.source.droppableId)
   const desColIndex = tempCol.findIndex((e) => e.alliance === result.destination.droppableId)
   tempCol[srcColIndex].parties.splice(result.source.index, 1)
   tempCol[desColIndex].parties.splice(result.destination.index, 0, result.draggableId)
   setRows(tempCol)
   tempCol.map((a) => {
     a.parties.map((p) => {
      tempCustomedPartyAlliance.push({ PARTY: p, ALLIANCE: a.alliance })
     })
   })
   setCustomedPartyAlliance(tempCustomedPartyAlliance)
  }

  const _resetPartyAlliance = () => setRows(alliancePartyData)

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
            Custom Alliances
          </div>
        </div>
        <DragDropContext onDragEnd={(result) => _ondragEnd(result)} >
          {rows.map((d) => {
            return (
              <Droppable droppableId={d.alliance} key={d.alliance} direction="horizontal">
                {(provided, snapshot) => {
                  return (
                    <div className="flex h-1/6 min-w-full my-8 rounded-lg border-2 border-gray-300">
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
                        className="h-full w-11/12 flex flex-wrap"
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
                                          className="flex flex-wrap content-center m-2 px-4 h-1/3 select-none w-min border-2 rounded-xl"
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
            <input type="button" value="RESET" className="black-btn cursor-pointer" onClick={_resetPartyAlliance} />
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
