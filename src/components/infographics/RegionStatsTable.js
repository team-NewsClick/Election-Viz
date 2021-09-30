import Loading from "../helpers/Loading"

/**
 * A table showing selected election and the compare election difference stats
 * @component
 * @param {Array<Object>} regionStatsTableData Parties/Alliances and their respective seats, seats difference, vote percent & vote percent difference
 * @param {Boolean} regionStatsLoading When true loading animation appears
 * @param {Object} selectedElection Selected election of the form {type: "assembly"/"general", year: "year"}
 * @param {Object} compareElection Selected election to compare in the form {type: "assembly"/"general", year: "year"}
 * @returns {JSX.Element} Stats in the form of table
 */
const RegionStatsTable = ({
  regionStatsTableData,
  regionStatsLoading,
  selectedElection,
  compareElection
}) => {
  return regionStatsTableData.length === 0 || regionStatsLoading == true ? (
    <div className="h-1/2 my-40">
      <Loading />
    </div>
  ) : (
    <div className="text-sm md:text-base">
      <div className="flex justify-center -mt-7 pb-1">
        <div className="flex flex-row">
          <div className="capitalize">
            {selectedElection.type} {selectedElection.year}
          </div>
          <div className="lowercase">&nbsp;v/s&nbsp;</div>
          {compareElection.type === "none" ? (
            <div className="capitalize">{compareElection.type}</div>
          ) : (
            <div className="capitalize">
              {compareElection.type} {compareElection.year}
            </div>
          )}
        </div>
      </div>
      <div className="flex bg-gray-300 border-b border-gray-400 font-semibold">
        <div className="w-2/12 border-r border-gray-400 px-1 py-2"></div>
        <div className="w-3/12 px-1 py-2 text-center">Seats</div>
        <div className="w-2/12 px-3 border-r border-gray-400 py-2">
          <img
            src="img/plus-minus.svg"
            alt="difference of"
            className="float-right"
          />
        </div>
        <div className="w-3/12 px-1 py-2 text-center">Vote%</div>
        <div className="w-2/12 px-3 py-2">
          <img
            src="img/plus-minus.svg"
            alt="difference of"
            className="float-right"
          />
        </div>
      </div>
      {regionStatsTableData.map((row, index) => (
        <div key={index} className="flex bg-gray-200 border-b border-gray-400">
          <div className="w-2/12 border-r border-gray-400 pl-1.5 py-2">
            {row.party || row.alliance}
          </div>
          <div className="w-3/12 px-1 py-2 text-center">{row.seats}</div>
          <div className="flex flex-row-reverse w-2/12 border-r border-gray-400 py-2 px-3">
            <div className="w-5/6 text-right">
              {Number.isNaN(parseInt(row.seatsDiff))
                ? row.seatsDiff
                : Math.abs(row.seatsDiff)}
            </div>
            <img
              src={row.seatsDiff <= 0 ? "img/down-red.svg" : "img/up-green.svg"}
              alt={row.seatsDiff <= 0 ? "decreased by" : "increased by"}
              className="w-4 mr-2"
            />
          </div>
          <div className="w-3/12 px-1 py-2 text-center">{row.votesPercent}</div>
          <div className="flex flex-row-reverse w-2/12 py-2 px-3">
            <div className="w-5/6 text-right">
              {Number.isNaN(parseFloat(row.votesPercentDiff))
                ? row.votesPercentDiff
                : Math.abs(row.votesPercentDiff)}
            </div>
            <img
              src={
                row.votesPercentDiff <= 0
                  ? "img/down-red.svg"
                  : "img/up-green.svg"
              }
              alt={row.votesPercentDiff <= 0 ? "decreased by" : "increased by"}
              className="w-4 mr-2"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default RegionStatsTable
