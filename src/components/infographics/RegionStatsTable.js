const RegionStatsTable = ({PartyAllianceTableData}) => {
  const tableData = Object.entries(PartyAllianceTableData).map((e) => ({ party: e[0], seats: e[1].seats }))
  
  return tableData.length === 0
    ? <div />
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
        {tableData.map((row) =>       
          <div className="flex bg-gray-200 border-b border-gray-400">
            <div className="w-2/12 border-r border-gray-400 pl-1.5 py-2">{row.party}</div>
            <div className="w-3/12 px-1 py-2 text-center">{row.seats}</div>
            <div className="flex flex-row-reverse w-2/12 border-r border-gray-400 py-2 px-3">
              <div className="w-5/6 text-right">--</div>
              <img src="img/up-green.svg" className="w-4 mr-2" />
            </div>
            <div className="w-3/12 px-1 py-2 text-center">--</div>
            <div className="flex flex-row-reverse w-2/12 py-2 px-3">
              <div className="w-5/6 text-right">--</div>
              <img src="img/up-green.svg" className="w-4 mr-2" />
            </div>
          </div>
        )}
      </div>
}

export default RegionStatsTable
