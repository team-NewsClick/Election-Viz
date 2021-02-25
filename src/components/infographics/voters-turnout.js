const VotersTurnout = () => {
  return (
    <div className="my-2">
      <div className="widget-title">Voters Turnout Stats</div>
      <div className=" hidden md:flex flex-wrap justify-center mx-auto my-6">
        <div className="flex flex-wrap radio-toolbar justify-center md:mx-2 my-2">
          <input
            type="radio"
            id="age"
            name="voters-type"
            value="age"
            defaultChecked
            onChange={(e) => console.log("age")}
          />
          <label htmlFor="age">Age</label>
          <input
            type="radio"
            id="gender"
            name="voters-type"
            value="gender"
            onChange={(e) => console.log("gender")}
          />
          <label htmlFor="gender">Gender</label>
          <input
            type="radio"
            id="education"
            name="voters-type"
            value="education"
            onChange={(e) => console.log("education")}
          />
          <label htmlFor="education">Education</label>
          <input
            type="radio"
            id="employement"
            name="voters-type"
            value="employement"
            onChange={(e) => console.log("employement")}
          />
          <label htmlFor="employement">Employement</label>
        </div>
      </div>
      <div className="md:hidden flex flex-wrap radio-toolbar justify-center md:mx-2 my-2 mt-8">
        <div> Show Voters Stats By:</div>
        <select
          name="voters-type"
          onChange={console.log("year")}
          onClick={console.log("year")}
          id="year"
          className="w-72"
        >
          <option value="age">Age</option>
          <option value="gender">Gender</option>
          <option value="education">Education</option>
          <option value="employement">Employement</option>
        </select>
      </div>
      <div className="table-dim">
        <div className="table-head">
          <div className="w-1/5">Age</div>
          <div className="w-4/5 md:flex">
            <div className="w-1/3 text-right">Voters Turnout Percent</div>
            <div className="w-1/3 text-right">Votes Casted</div>
            <div className="w-1/3 text-right">Total Voters</div>
          </div>
        </div>
        <div className="details-list md:px-4">
          <div className="sub-summary md:pl-0">
            <div className="md:hidden">Age: &nbsp;</div>
            <div>Below 30 years</div>
          </div>
          <div className="details-list-body">
            <div className="details-param md:w-1/3">
              <div className="details-param-title">Voters Turnout Percent</div>
              <div className="details-param-data">65.20%</div>
            </div>
            <div className="details-param md:w-1/3">
              <div className="details-param-title">Votes Casted</div>
              <div className="details-param-data">23,485</div>
            </div>
            <div className="details-param md:w-1/3">
              <div className="details-param-title">Total Voters</div>
              <div className="details-param-data">36,025</div>
            </div>
          </div>
        </div>
        <div className="details-list md:px-4">
          <div className="sub-summary md:pl-0">
            <div className="md:hidden">Age: &nbsp;</div>
            <div>Between 30 - 60 years</div>
          </div>
          <div className="details-list-body">
            <div className="details-param md:w-1/3">
              <div className="details-param-title">
                Voters Turnout Percent
              </div>
              <div className="details-param-data">75.20%</div>
            </div>
            <div className="details-param md:w-1/3">
              <div className="details-param-title">Votes Casted</div>
              <div className="details-param-data">32,485</div>
            </div>
            <div className="details-param md:w-1/3">
              <div className="details-param-title">Total Voters</div>
              <div className="details-param-data">58,025</div>
            </div>
          </div>
        </div>
        <div className="details-list md:px-4">
          <div className="sub-summary md:pl-0">
            <div className="md:hidden">Age: &nbsp;</div>
            <div>Above 60 years</div>
          </div>
          <div className="details-list-body">
            <div className="details-param md:w-1/3">
              <div className="details-param-title">
                Voters Turnout Percent
              </div>
              <div className="details-param-data">45.20%</div>
            </div>
            <div className="details-param md:w-1/3">
              <div className="details-param-title">Votes Casted</div>
              <div className="details-param-data">28,485</div>
            </div>
            <div className="details-param md:w-1/3">
              <div className="details-param-title">Total Voters</div>
              <div className="details-param-data">58,965</div>
            </div>
          </div>
        </div>
        <div className="details-list md:px-4 bg-gray-300 border-t-2 border-b-0 border-gray-500">
          <div className="sub-summary font-bold md:pl-0">
            Total
          </div>
          <div className="details-list-body">
            <div className="details-param md:w-1/3">
              <div className="details-param-title">
                Voters Turnout Percent
              </div>
              <div className="details-param-data">59.65%</div>
            </div>
            <div className="details-param md:w-1/3">
              <div className="details-param-title">Votes Casted</div>
              <div className="details-param-data">1,05,134</div>
            </div>
            <div className="details-param md:w-1/3">
              <div className="details-param-title">Total Voters</div>
              <div className="details-param-data">1,58,965</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VotersTurnout
