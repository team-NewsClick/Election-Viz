import { useState, useEffect } from "react"

const SwingsModal = () => {
  const [valueSwing_A, setValueSwing_A] = useState("0")

  useEffect(() => {
    let input_A = document.getElementById("input_A")
    let thumbLeft = document.querySelector("#slider_A > #thumb_A")
    let range = document.querySelector("#slider_A > #range_A")
    let valueSwingDisaply = document.getElementById("valueSwingDisaply_A")
    let min = parseInt(input_A.min)
    let max = parseInt(input_A.max)
    let value = parseInt(input_A.value)
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
  }, [valueSwing_A])

  return (
    <div className="flex flex-row relative w-full">
      <div className="w-1/12 font-bold">A</div>
      <div className="relative w-11/12">
        <input
          type="range"
          id="input_A"
          min={-25}
          max={25}
          value={valueSwing_A}
          className="absolute h-4 w-full opacity-0"
          style={{ zIndex: 2, left: 0 }}
          onChange={(e) => setValueSwing_A(e.target.value)}
        />
        <div
          id="slider_A"
          className="relative h-2 bg-gray-300"
          style={{ zIndex: 1 }}
        >
          <div className="left-0 right-0 top-0 bottom-0 rounded-full" />
          <div
            id="range_A"
            className="absolute left-1/4 right-1/4 top-0 bottom-0 bg-blue-500 rounded-full"
            style={{ zIndex: 2 }}
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
            id="thumb_A"
            className="absolute w-4 h-4 bg-blue-800 rounded-full opacity-100 left-1/4"
            style={{
              transform: "translate(-0.5rem, -0.25rem)",
              left: 0,
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
            style={{ transform: "translate(-0.5rem, 1rem)", left: "50%" }}
          >
            0%
          </div>
          <div
            className="absolute text-gray-400"
            style={{ transform: "translate(-1.5rem, 1rem)", left: "100%" }}
          >
            +25%
          </div>
          <div
            id="valueSwingDisaply_A"
            className="absolute rounded-full left-1/4 font-bold"
            style={{ transform: "translate(-0.5rem, -2rem)", left: 0 }}
          >
            {valueSwing_A > 0 ? "+" + valueSwing_A : valueSwing_A}%
          </div>
        </div>
      </div>
    </div>
  )
}

export default SwingsModal
