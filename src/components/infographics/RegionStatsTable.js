import Loading from "../Loading"

const RegionStatsTable = ({regionStatsTableData, regionStatsLoading}) => {
  
  return (regionStatsTableData.length === 0 || regionStatsLoading == true)
    ? <div className="h-1/2 my-40"><Loading /></div> 
    : <div className="text-sm md:text-base">
        <div className="flex bg-gray-300 border-b border-gray-400 font-semibold">
          <div className="w-2/12 border-r border-gray-400 px-1 py-2"></div>
          <div className="w-3/12 px-1 py-2 text-center">Seats Won</div>
          <div className="w-2/12 px-3 border-r border-gray-400 py-2">
            <img src="img/plus-minus.svg" className="float-right" />
          </div>
          <div className="w-3/12 px-1 py-2 text-center">Votes% Won</div>
          <div className="w-2/12 px-3 py-2">
            <img src="img/plus-minus.svg" className="float-right" />
          </div>
        </div>
        {regionStatsTableData.map((row, index) =>       
          <div key={index} className="flex bg-gray-200 border-b border-gray-400">
            <div className="w-2/12 border-r border-gray-400 pl-1.5 py-2">{row.party || row.alliance}</div>
            <div className="w-3/12 px-1 py-2 text-center">{row.seats}</div>
            <div className="flex flex-row-reverse w-2/12 border-r border-gray-400 py-2 px-3">
              <div className="w-5/6 text-right">{Math.abs(row.seatsDiff)}</div>
              <img src={row.seatsDiff >= 0 ?"img/up-green.svg" : "img/down-red.svg"} className="w-4 mr-2" />
            </div>
            <div className="w-3/12 px-1 py-2 text-center">{row.votesPercent}</div>
            <div className="flex flex-row-reverse w-2/12 py-2 px-3">
              <div className="w-5/6 text-right">{Math.abs(row.votesPercentDiff)}</div>
              <img src={row.votesPercentDiff >= 0 ?"img/up-green.svg" : "img/down-red.svg"} className="w-4 mr-2" />
            </div>
          </div>
        )}
      </div>
}

export default RegionStatsTable
