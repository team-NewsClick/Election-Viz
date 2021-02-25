const VotersTurnout = () => {
  return (
    <div className="my-2">
      <div className="widget-title">Voters Turnout Stats</div>
      <div className="table-dim">
        <div className="table-head">
          <div className="w-1/5">Candidate"s Name</div>
          <div className="w-4/5 md:flex text-right">
            <div className="w-1/4">Party</div>
            <div className="w-1/4">Alliance</div>
            <div className="w-1/4">Votes Received</div>
          </div>
        </div>
        <div className="details-list md:px-4">
          <div className="sub-summary md:pl-0">
            <div className="flex w-11/12 md:w-full">
              <div className="md:hidden">Candidate"s Name: &nbsp;</div>
              <div>Yogi Adityanath</div>
            </div>
            <div className="flex justify-end pr-2 md:hidden">
              <img
                id="showHideAdvance-btn-icon"
                src="../img/green-tick.svg"
                alt="Is A Winner"
                className=""
              />
            </div>
          </div>
          <div className="details-list-body">
            <div className="details-param md:w-1/4">
              <div className="details-param-title">Party</div>
              <div className="details-param-data">BJP</div>
            </div>
            <div className="details-param md:w-1/4">
              <div className="details-param-title">Aliance</div>
              <div className="details-param-data">NDA</div>
            </div>
            <div className="details-param md:w-1/4">
              <div className="details-param-title">Votes Reveived</div>
              <div className="details-param-data">30,256</div>
            </div>
            <div className="md:w-1/4 hidden md:block">
              <img
                id="showHideAdvance-btn-icon"
                src="../img/green-tick.svg"
                alt="Is A Winner"
                className="mx-auto"
              />
            </div>
          </div>
        </div>
        <div className="details-list md:px-4">
          <div className="sub-summary md:pl-0">
            <div className="md:hidden">Candidate"s Name: &nbsp;</div>
            <div>John Doe</div>
          </div>
          <div className="details-list-body">
            <div className="details-param md:w-1/4">
              <div className="details-param-title">Party</div>
              <div className="details-param-data">CONG</div>
            </div>
            <div className="details-param md:w-1/4">
              <div className="details-param-title">Aliance</div>
              <div className="details-param-data">INC</div>
            </div>
            <div className="details-param md:w-1/4">
              <div className="details-param-title">Votes Reveived</div>
              <div className="details-param-data">25,254</div>
            </div>
          </div>
        </div>
        <div className="details-list md:px-4">
          <div className="sub-summary md:pl-0">
            <div className="md:hidden">Candidate"s Name: &nbsp;</div>
            <div>Regina Philange</div>
          </div>
          <div className="details-list-body">
            <div className="details-param md:w-1/4">
              <div className="details-param-title">Party</div>
              <div className="details-param-data">BSP</div>
            </div>
            <div className="details-param md:w-1/4">
              <div className="details-param-title">Aliance</div>
              <div className="details-param-data">INC</div>
            </div>
            <div className="details-param md:w-1/4">
              <div className="details-param-title">Votes Reveived</div>
              <div className="details-param-data">11,568</div>
            </div>
          </div>
        </div>
        <div className="details-list md:px-4">
          <div className="sub-summary md:pl-0">
            <div className="md:hidden">Candidate"s Name: &nbsp;</div>
            <div>Dawa Kumar</div>
          </div>
          <div className="details-list-body">
            <div className="details-param md:w-1/4">
              <div className="details-param-title">Party</div>
              <div className="details-param-data">SP</div>
            </div>
            <div className="details-param md:w-1/4">
              <div className="details-param-title">Aliance</div>
              <div className="details-param-data">ABC</div>
            </div>
            <div className="details-param md:w-1/4">
              <div className="details-param-title">Votes Reveived</div>
              <div className="details-param-data">29,254</div>
            </div>
          </div>
        </div>
        <div className="details-list md:px-4">
          <div className="sub-summary md:pl-0">
            <div className="md:hidden">Candidate"s Name: &nbsp;</div>
            <div>Leonard Mukherjee</div>
          </div>
          <div className="details-list-body">
            <div className="details-param md:w-1/4">
              <div className="details-param-title">Party</div>
              <div className="details-param-data">IND</div>
            </div>
            <div className="details-param md:w-1/4">
              <div className="details-param-title">Aliance</div>
              <div className="details-param-data">IND</div>
            </div>
            <div className="details-param md:w-1/4">
              <div className="details-param-title">Votes Reveived</div>
              <div className="details-param-data">3,254</div>
            </div>
          </div>
        </div>
        <div className="details-list px-4 bg-gray-300 border-t-2 border-b-0 border-gray-500">
          <div className="details-param md:w-1/5">
            <div className="w-2/3 md:w-auto font-bold">Total Contestants: &nbsp;</div>
            <div className="w-1/3 md:w-auto">5</div>
          </div>
          <div className="md:flex md:w-4/5">
            <div className="flex md:w-1/4 md:justify-end">
              <div className="w-2/3 md:w-auto font-bold">Total Parties: &nbsp;</div>
              <div className="w-1/3 md:w-auto">4</div>
            </div>
            <div className="flex md:w-1/4 md:justify-end">
              <div className="w-2/3 md:w-auto font-bold">Total Alliances: &nbsp;</div>
              <div className="w-1/3 md:w-auto">3</div>
            </div>
            <div className="flex md:w-1/4 md:justify-end">
              <div className="w-2/3 md:w-auto font-bold">Total Votes: &nbsp;</div>
              <div className="w-1/3 md:w-auto">99,584</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VotersTurnout
