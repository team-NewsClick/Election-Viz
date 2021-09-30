import { useState, useEffect } from "react"
import { ALL_STATE_UT } from "../../constants"
import { getParams, addParams } from "../../helpers/swings"

/**
 * Modal Box for adding swings to alliances
 * @component
 * @param {String} param0 Name of selected State/UT
 * @param {String} param1 Selected Year
 * @param {Function} param2 Function to update the swings
 * @returns {JSX.Element} Modal Box for adding swings to alliances
 */
const SwingsModal = ({
  selectedElection,
  handleSwingParams,
  selectedStateUT,
  partyAlliance,
  advanceReset
}) => {
  const [partyAllianceParams, setPartyAllianceParams] = useState([])
  const [swingTotal, setSwingTotal] = useState(0)
  const [swingUpdate, setSwingUpdate] = useState()

  useEffect(() => {
    setSwingUpdate([])
    _reset()
  }, [selectedStateUT, advanceReset])

  useEffect(() => {
    if (partyAlliance.length !== 0) {
      setSwingUpdate([])
      const initParmas = getParams(partyAlliance)
      const tempParams = []
      initParmas.map((d) => {
        const thumbLeft = document.getElementById(d.thumbId)
        const range = document.getElementById(d.rangeId)
        const valueSwingDisaply = document.getElementById(d.valueSwingDisaplyId)
        thumbLeft.style.left = "50%"
        valueSwingDisaply.style.left = "50%"
        range.style.right = "50%"
        range.style.left = "50%"
        d.swing = 0
        tempParams.push(d)
      })
      setPartyAllianceParams([...tempParams])
    }
  }, [selectedStateUT, advanceReset])

  useEffect(() => {
    let temp = 0
    if (selectedStateUT !== ALL_STATE_UT) {
      partyAllianceParams.map((d) => (temp = temp + parseInt(d.swing)))
      setSwingTotal(temp)
    }
  }, [partyAllianceParams])

  useEffect(() => {
    handleSwingParams(swingUpdate)
  }, [swingUpdate])

  useEffect(() => {
    const tempNewParams = []
    const tempPartyAllianceParams = partyAllianceParams.filter(
      (d) => partyAlliance.findIndex((e) => e.ALLIANCE === d.alliance) !== -1
    )
    partyAlliance &&
      partyAlliance.map((d) => {
        if (
          partyAllianceParams.findIndex((e) => e.alliance === d.ALLIANCE) === -1
        ) {
          let temp = []
          temp = addParams([d.ALLIANCE])
          temp[0].newAlliance = true
          if (
            tempNewParams.findIndex((p) => p.alliance === temp[0].alliance) ===
            -1
          ) {
            tempNewParams.push(...temp)
          }
        }
        setPartyAllianceParams(tempPartyAllianceParams.concat(tempNewParams))
      })
  }, [partyAlliance])

  const _handelchange = (swing, index) => {
    let temp = partyAllianceParams
    temp[index].swing = swing
    let input = document.getElementById(temp[index].inputId)
    let thumbLeft = document.getElementById(temp[index].thumbId)
    let range = document.getElementById(temp[index].rangeId)
    let valueSwingDisaply = document.getElementById(
      temp[index].valueSwingDisaplyId
    )
    let min = parseInt(input.min)
    let max = parseInt(input.max)
    let value = parseInt(input.value)
    let percent = ((value - min) / (max - min)) * 100
    if (percent <= 50) {
      thumbLeft.style.left = percent + "%"
      valueSwingDisaply.style.left = percent + "%"
      range.style.right = "50%"
      range.style.left = percent + "%"
    } else {
      thumbLeft.style.left = percent + "%"
      valueSwingDisaply.style.left = percent + "%"
      range.style.right = 100 - percent + "%"
      range.style.left = "50%"
    }
    setPartyAllianceParams([...temp])
  }

  const _reset = () => {
    if (partyAllianceParams.length !== 0 && partyAlliance.length !== 0) {
      const tempPartyAlliance = partyAlliance
      const initParmas = getParams(tempPartyAlliance)
      const tempParams = []
      initParmas.map((d) => {
        if (
          document.getElementById(d.thumbId) &&
          document.getElementById(d.rangeId) &&
          document.getElementById(d.valueSwingDisaplyId)
        ) {
          const thumbLeft = document.getElementById(d.thumbId)
          const range = document.getElementById(d.rangeId)
          const valueSwingDisaply = document.getElementById(
            d.valueSwingDisaplyId
          )
          thumbLeft.style.left = "50%"
          valueSwingDisaply.style.left = "50%"
          range.style.right = "50%"
          range.style.left = "50%"
          d.swing = 0
          tempParams.push(d)
        }
      })
      setPartyAllianceParams([...tempParams])
    }
    setSwingUpdate([])
  }

  const _update = () => {
    if (swingTotal !== 0) _reset()
    const temp = partyAllianceParams.map((d) => {
      return {
        alliance: d.alliance,
        swing: parseInt(d.swing),
        newAlliance: d.newAlliance
      }
    })
    setSwingUpdate([...temp])
    openSwingModal()
  }

  const openSwingModal = () => {
    const swingModal = document.getElementById("swingModal")
    swingModal.style.display === "none"
      ? (swingModal.style.display = "flex")
      : (swingModal.style.display = "none")
  }

  return (
    <div
      className="flex h-full min-h-screen justify-center bg-white bg-opacity-70 overscroll-contain overflow-scroll"
      style={{ minWidth: "100vw", height: "fit-content" }}
    >
      <div className="w-11/12 md:w-5/6 bg-gray-100 border-2 rounded-lg border-gray-200 my-8 p-3">
        <div>
          <div className="flex justify-end cursor-pointer" onClick={_update}>
            <img
              id="openSwingModal-btn-icon"
              src="../img/close-btn.svg"
              alt="Close swings modal box"
              className="w-4 h-4"
            />
          </div>
          <div className="flex justify-center font-bold text-2xl">
            Swing Distribution of {selectedStateUT}
          </div>
        </div>
        <div className="w-10/12 mx-auto">
          {partyAllianceParams.length != 0 &&
            partyAllianceParams.map((d, index) => (
              <div key={index} className="flex flex-row relative w-full my-16">
                <div className="w-1/12 font-bold">{d.alliance}</div>
                <div className="relative w-11/12">
                  <input
                    type="range"
                    id={d.inputId}
                    min={-25}
                    max={25}
                    value={d.swing}
                    className="absolute h-4 w-full opacity-0"
                    style={{ zIndex: 2, left: 0 }}
                    onChange={(e) => _handelchange(e.target.value, index)}
                  />
                  <div
                    id={d.sliderId}
                    className="relative h-2 bg-gray-300"
                    style={{ zIndex: 1 }}
                  >
                    <div className="left-0 right-0 top-0 bottom-0 rounded-full" />
                    <div
                      id={d.rangeId}
                      className="absolute left-1/4 right-1/4 top-0 bottom-0 bg-blue-500 rounded-full"
                      style={{ zIndex: 2, right: "50%", left: "50%" }}
                    />
                    <div
                      className="absolute w-4 h-4 bg-gray-300 rounded-full opacity-100 right-1/4"
                      style={{
                        transform: "translate(0.5rem, -0.25rem)",
                        right: "50%",
                        zIndex: 3
                      }}
                    />
                    <div
                      id={d.thumbId}
                      className="absolute w-4 h-4 bg-blue-800 rounded-full opacity-100 left-1/4"
                      style={{
                        transform: "translate(-0.5rem, -0.25rem)",
                        left: "50%",
                        zIndex: 3
                      }}
                    />
                    <div
                      className="absolute text-gray-400"
                      style={{ transform: "translate(-1rem, 1rem)", left: 0 }}
                    >
                      -25%
                    </div>
                    <div
                      className="absolute text-gray-400"
                      style={{
                        transform: "translate(-0.5rem, 1rem)",
                        left: "50%"
                      }}
                    >
                      0%
                    </div>
                    <div
                      className="absolute text-gray-400"
                      style={{
                        transform: "translate(-1.5rem, 1rem)",
                        left: "100%"
                      }}
                    >
                      +25%
                    </div>
                    <div
                      id={d.valueSwingDisaplyId}
                      className="absolute rounded-full left-1/4 font-bold"
                      style={{
                        transform: "translate(-0.5rem, -2rem)",
                        left: "50%"
                      }}
                    >
                      {d.swing > 0 ? "+" + d.swing : d.swing}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          <div style={swingTotal !== 0 ? { color: "#d11143" } : {}}>
            <div className="text-3xl font-bold">
              Total Swing: {swingTotal}%{" "}
            </div>
            <div>
              Total Swing must be 0%, otherwise it will reset to default.
            </div>
          </div>
          <div className="flex justify-between">
            <input
              type="button"
              value="RESET"
              onClick={() => _reset()}
              className="black-btn cursor-pointer"
            />
            <input
              type="button"
              value="OK"
              onClick={() => _update()}
              className="black-btn cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SwingsModal
