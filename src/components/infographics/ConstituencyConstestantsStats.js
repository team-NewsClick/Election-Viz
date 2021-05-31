/**
 * Table of Stats of each Candidate of a constituency and total summary
 * @param {Object} param0 - contains Array of Objects having data as a stats for every Contestants and an Object having total summary of the stats
 * @returns {JSX.Element} Table of Stats of each Candidate of a constituency and total summary
 */
const ConstituencyConstestantsStats = ({
  constituencyContestantsStatsData
}) => {
  const stats = constituencyContestantsStatsData.stats
  const totalStats = constituencyContestantsStatsData.totalStats
  return (
    <div className="my-2">
      <div className="widget-title">Constituency’s Contestants Votes Stats</div>
      <div className="table-dim">
        <div className="table-head">
          <div className="w-1/5">Candidate's Name</div>
          <div className="w-4/5 md:flex text-right">
            <div className="w-1/4">Party</div>
            <div className="w-1/4">Alliance</div>
            <div className="w-1/4">Votes Received</div>
          </div>
        </div>
        {stats.map((d, index) => (
          <div key={index} className="details-list md:px-4">
            <div className="sub-summary md:pl-0">
              <div className="flex w-11/12 md:w-full">
                <div className="md:hidden">Candidate's Name: &nbsp;</div>
                <div>{d.candidate}</div>
              </div>
              {d.status === "won" && (
                <div className="flex justify-end pr-2 md:hidden">
                  <img
                    id="showHideAdvance-btn-icon"
                    src="../img/green-tick.svg"
                    alt="Is A Winner"
                    className=""
                  />
                </div>
              )}
            </div>
            <div className="details-list-body">
              <div className="details-param md:w-1/4">
                <div className="details-param-title">Party</div>
                <div className="details-param-data">{d.party}</div>
              </div>
              <div className="details-param md:w-1/4">
                <div className="details-param-title">Aliance</div>
                <div className="details-param-data">{d.alliance}</div>
              </div>
              <div className="details-param md:w-1/4">
                <div className="details-param-title">Votes Reveived</div>
                <div className="details-param-data">{d.votesReceived}</div>
              </div>
              {d.status === "won" && (
                <div className="md:w-1/4 hidden md:block">
                  <img
                    id="showHideAdvance-btn-icon"
                    src="../img/green-tick.svg"
                    alt="Is A Winner"
                    className="mx-auto"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="details-list px-4 bg-gray-300 border-t-2 border-b-0 border-gray-500">
          <div className="details-param md:w-1/5">
            <div className="w-2/3 md:w-auto font-bold">
              Total Contestants: &nbsp;
            </div>
            <div className="w-1/3 md:w-auto">{totalStats.candidates}</div>
          </div>
          <div className="md:flex md:w-4/5">
            <div className="flex md:w-1/4 md:justify-end">
              <div className="w-2/3 md:w-auto font-bold">
                Total Parties: &nbsp;
              </div>
              <div className="w-1/3 md:w-auto">{totalStats.parties}</div>
            </div>
            <div className="flex md:w-1/4 md:justify-end">
              <div className="w-2/3 md:w-auto font-bold">
                Total Alliances: &nbsp;
              </div>
              <div className="w-1/3 md:w-auto">{totalStats.alliances}</div>
            </div>
            <div className="flex md:w-1/4 md:justify-end">
              <div className="w-2/3 md:w-auto font-bold">
                Total Votes: &nbsp;
              </div>
              <div className="w-1/3 md:w-auto">{totalStats.votes}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConstituencyConstestantsStats
