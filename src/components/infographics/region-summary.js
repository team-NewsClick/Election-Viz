import parliamentSVG from "parliament-svg"
import stringify from "virtual-dom-stringify"
import parse from "html-react-parser"

const RegionSummary = () => {
  const data = {
    NDA: {
      seats: 78,
      colour: "#f97d09",
    },
    BSP: {
      seats: 11,
      colour: "#bd0026",
    },
    INC: {
      seats: 38,
      colour: "#138808",
    },
    IND: {
      seats: 6,
      colour: "#333",
    },
    Others: {
      seats: 4,
      colour: "#a6a6a6",
    },
  }
  const virtualNodeSemicircle = parliamentSVG(data, true)
  const semicircle = stringify(virtualNodeSemicircle)

  const regionType = "state"
  const totalConstituencies = 137

  return (
    <div className="bg-gray-50 rounded border border-gray-300 py-0.5 lg:pt-8 px-2 md:px-6 heightImp100">
      {totalConstituencies > 2 ? (
        <div>
          <div className="max-w-3xl px-4 pt-5">{parse(semicircle)}</div>
        </div>
      ) : (
        <div className="flex justify-center h-64 mt-4">
          <svg height="100" width="100" className="m-auto">
            <circle cx="50" cy="50" r="50" fill="#f97d09" />
          </svg>
          <svg height="100" width="100" className="m-auto">
            <circle cx="50" cy="50" r="50" fill="#f97d09" />
          </svg>
        </div>
      )}
      {regionType == "state" ? (
        <div className="lg:pb-2">
          <div className="flex  flex-wrap justify-between mx-4 mt-9 mb-10">
            <div className="grid justify-items-center px-0.5 py-1.5">
              <div
                className="w-10 h-2"
                style={{ backgroundColor: "#f97d09" }}
              ></div>
              <div>NDA: 78</div>
            </div>
            <div className="grid justify-items-center px-0.5 py-1.5">
              <div
                className="w-10 h-2"
                style={{ backgroundColor: "#bd0026" }}
              ></div>
              <div>BSP: 11</div>
            </div>
            <div className="grid justify-items-center px-0.5 py-1.5">
              <div
                className="w-10 h-2"
                style={{ backgroundColor: "#138808" }}
              ></div>
              <div>INC: 38</div>
            </div>
            <div className="grid justify-items-center px-0.5 py-1.5">
              <div
                className="w-10 h-2"
                style={{ backgroundColor: "#333" }}
              ></div>
              <div>IND1: 6</div>
            </div>
            <div className="grid justify-items-center px-0.5 py-1.5">
              <div
                className="w-10 h-2"
                style={{ backgroundColor: "#a6a6a6" }}
              ></div>
              <div>Others: 4</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center my-8">BJP</div>
      )}
      {regionType == "state" ? (
        <div>
          <div className="flex my-2">
            <div className="w-3/5 font-bold">Chief Minister</div>
            <div className="w-2/5">Yogi Adityanath</div>
          </div>
          <div className="flex my-2">
            <div className="w-3/5 font-bold">State</div>
            <div className="w-2/5">Uttar Pradesh</div>
          </div>
          <div className="flex my-2">
            <div className="w-3/5 font-bold">Gender</div>
            <div className="w-2/5">Male</div>
          </div>
          <div className="flex my-2">
            <div className="w-3/5 font-bold">Education</div>
            <div className="w-2/5">Graduate</div>
          </div>
          <div className="flex my-2">
            <div className="w-3/5 font-bold">Criminal Record</div>
            <div className="w-2/5">No</div>
          </div>
          <div className="flex my-2">
            <div className="w-3/5 font-bold">First time as MP/MLA</div>
            <div className="w-2/5">No</div>
          </div>
          <div className="flex my-2">
            <div className="w-3/5 font-bold">Party</div>
            <div className="w-2/5">BJP</div>
          </div>
          <div className="flex my-2">
            <div className="w-3/5 font-bold">Alliance</div>
            <div className="w-2/5">NDA</div>
          </div>
          <div className="flex my-2">
            <div className="w-3/5 font-bold">Contituencies Won</div>
            <div className="w-2/5">56</div>
          </div>
          <div className="flex my-2">
            <div className="w-3/5 font-bold">Total Constituencies</div>
            <div className="w-2/5">86</div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex my-2">
            <div className="w-3/5 font-bold">Winning Candidate</div>
            <div className="w-2/5">Yogi Adityanath</div>
          </div>
          <div className="flex my-2">
            <div className="w-3/5 font-bold">Constituency</div>
            <div className="w-2/5">Gorakhpur</div>
          </div>
          <div className="flex my-2">
            <div className="w-3/5 font-bold">State</div>
            <div className="w-2/5">Uttar Pradesh</div>
          </div>
          <div className="flex my-2">
            <div className="w-3/5 font-bold">Gender</div>
            <div className="w-2/5">Male</div>
          </div>
          <div className="flex my-2">
            <div className="w-3/5 font-bold">Education</div>
            <div className="w-2/5">Graduate</div>
          </div>
          <div className="flex my-2">
            <div className="w-3/5 font-bold">Criminal Record</div>
            <div className="w-2/5">No</div>
          </div>
          <div className="flex my-2">
            <div className="w-3/5 font-bold">First time as MP/MLA</div>
            <div className="w-2/5">No</div>
          </div>
          <div className="flex my-2">
            <div className="w-3/5 font-bold">Party</div>
            <div className="w-2/5">BJP</div>
          </div>
          <div className="flex my-2">
            <div className="w-3/5 font-bold">Alliance</div>
            <div className="w-2/5">NDA</div>
          </div>
          <div className="flex my-2">
            <div className="w-3/5 font-bold">Contituencies Won</div>
            <div className="w-2/5">56</div>
          </div>
          <div className="flex my-2">
            <div className="w-3/5 font-bold">Total Constituencies</div>
            <div className="w-2/5">86</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RegionSummary
