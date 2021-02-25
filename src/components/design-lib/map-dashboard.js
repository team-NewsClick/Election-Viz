const MapDashboard = () => {
    const showHideAdvanceOptionsWeb = () => {
      const options = document.getElementById("advanceOptionsWeb")
      const btnText = document.getElementById("showHideAdvance-btn")
      const btnIcon = document.getElementById("showHideAdvance-btn-icon")
      options.style.display === "none"
      ? (
          options.style.display = "block",
          btnText.innerHTML = "Hide Advance Options",
          btnIcon.style.transform = "rotate(180deg)"
        )
      : (
          options.style.display = "none",
          btnText.innerHTML = "Show Advance Options",
          btnIcon.style.transform = "rotate(0deg)"
        )
      }
  
    return (
      <div>
        <div className="h-10" />
        <div className="flex flex-wrap justify-center mx-auto">
          <div className="radio-toolbar md:mx-2 my-2">
            <input
              type="radio"
              id="general"
              name="election"
              value="general"
              onChange={(e) => console.log("general")}
            />
            <label htmlFor="general">General Elections</label>
            <input
              type="radio"
              id="assembly"
              name="election"
              value="assembly"
              defaultChecked
              onChange={(e) => console.log("assembly")}
            />
            <label htmlFor="assembly">Assembly Elections</label>
          </div>
          <div className="radio-toolbar md:mx-2 my-2">
            <input
              type="radio"
              id="party"
              name="group"
              value="party"
              onChange={(e) => console.log("party")}
            />
            <label htmlFor="party">Party</label>
            <input
              type="radio"
              id="alliance"
              name="group"
              value="alliance"
              defaultChecked
              onChange={(e) => console.log("alliance")}
            />
            <label htmlFor="alliance">Alliance</label>
          </div>
          <div>
            <select
              name="year"
              onChange={console.log("year")}
              onClick={console.log("year")}
              id="year"
              className="w-28 md:w-64"
            >
              <option value="2019">2019</option>
              <option value="2015">2015</option>
            </select>
          </div>
          <div onClick={showHideAdvanceOptionsWeb} className="max-w-sm justify-center flex cursor-pointer w-42 md:w-64 bg-gray-800 text-white rounded border border-gray-500 h-7 m-2 text-sm">
            <div id="showHideAdvance-btn" className="my-auto mx-3">Show Advance Options</div>
            <div>
              <img
                id="showHideAdvance-btn-icon"
                src="../img/down-arrow.svg"
                alt="Show Advance Options"
                className="w-3 h-3 md:ml-14 m-1.5"
              />
            </div>
          </div>
        </div>
        <div id="advanceOptionsWeb" style={{display: "none"}} className="bg-gray-100 z-10 h-full md:h-auto absolute md:relative inset-x-auto top-0 md:top-auto">
          <div className="h-0.5 bg-gray-300 w-full max-w-4xl my-3.5 mx-auto hidden md:block">
            &nbsp;
          </div>
          <div className="flex justify-center my-8 md:hidden">
            <div className="font-bold">Advance Options</div>
            <div className="absolute top-8 right-6 cursor-pointer" onClick={showHideAdvanceOptionsWeb} >
              <img
                id="showHideAdvance-btn-icon"
                src="../img/close-btn.svg"
                alt="Close Button"
                className="w-4 h-4"
              /></div>
          </div>
          <div className="mx-auto max-w-4xl justify-center">
            <div className="flex flex-wrap mx-auto justify-around md:justify-center ">
              <div>
                <select
                  name="year"
                  onChange={console.log("year")}
                  onClick={console.log("year")}
                  id="year"
                  className="advance-select"
                >
                  <option value="all-regions">All Regions</option>
                  <option value="hindi-heartland">Hindi-Heartland</option>
                  <option value="north">North</option>
                  <option value="east">East</option>
                  <option value="north-east">North-East</option>
                  <option value="south">South</option>
                  <option value="west">West</option>
                </select>
              </div>
              <div>
                <select
                  name="year"
                  onChange={console.log("year")}
                  onClick={console.log("year")}
                  id="year"
                  className="advance-select"
                >
                  <option value="all-states">All States</option>
                  <option value="uttar-pradesh">Uttar Pradesh</option>
                  <option value="others">Coming soon...</option>
                </select>
              </div>
              <div>
                <select
                  name="year"
                  onChange={console.log("year")}
                  onClick={console.log("year")}
                  id="year"
                  className="advance-select"
                >
                  <option value="all-localities">All Localities</option>
                  <option value="urban">Urban</option>
                  <option value="semi-urban">Semi-Urban</option>
                  <option value="rural">Rural</option>
                </select>
              </div>
              <div>
                <select
                  name="year"
                  onChange={console.log("year")}
                  onClick={console.log("year")}
                  id="year"
                  className="advance-select"
                >
                  <option value="all-constituencies">All Constituencies</option>
                  <option value="gorakhpur">Gorakhpur</option>
                  <option value="others">Coming soon...</option>
                </select>
              </div>
              <div>
                <select
                  name="year"
                  onChange={console.log("year")}
                  onClick={console.log("year")}
                  id="year"
                  className="advance-select"
                >
                  <option value="all-communities">All Communities</option>
                  <option value="general">General</option>
                  <option value="sc">SC</option>
                  <option value="st">ST</option>
                  <option value="obc">OBC</option>
                  <option value="other-communities">Other Communities</option>
                </select>
              </div>
              <div>
                <select
                  name="year"
                  onChange={console.log("year")}
                  onClick={console.log("year")}
                  id="year"
                  className="advance-select"
                >
                  <option value="all-genders">All Genders</option>
                  <option value="male">Males</option>
                  <option value="female">Females</option>
                </select>
              </div>
              <div>
                <select
                  name="year"
                  onChange={console.log("year")}
                  onClick={console.log("year")}
                  id="year"
                  className="advance-select"
                >
                  <option value="all-education">All Education Levels</option>
                  <option value="graduates">Graduates</option>
                  <option value="non-graduates">Non-Graduates</option>
                </select>
              </div>
              <div>
                <select
                  name="year"
                  onChange={console.log("year")}
                  onClick={console.log("year")}
                  id="year"
                  className="advance-select"
                >
                  <option value="all-experiences">All Experiences</option>
                  <option value="experience">Experienced</option>
                  <option value="fresher">Freshers</option>
                </select>
              </div>
              <div>
                <select
                  name="year"
                  onChange={console.log("year")}
                  onClick={console.log("year")}
                  id="year"
                  className="advance-select"
                >
                  <option value="all-criminality">All Criminality</option>
                  <option value="criminal-record">Criminal Record</option>
                  <option value="no-criminal-record">No Criminal Record</option>
                </select>
              </div>
              <div>
                <select
                  name="year"
                  onChange={console.log("year")}
                  onClick={console.log("year")}
                  id="year"
                  className="advance-select"
                >
                  <option value="all-seat-type">All Seat Types</option>
                  <option value="gained">Gained</option>
                  <option value="reserved">Reserved</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
            </div>
            <div className="flex my-4 max-w-sm md:max-w-full mx-auto justify-between md:hidden">
              <div>
                <input
                  type="button"
                  value="RESET"
                  className="black-btn"
                />
              </div>
              <div>
                <input
                  type="button"
                  value="OK"
                  onClick={showHideAdvanceOptionsWeb}
                  className="black-btn"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default MapDashboard
  