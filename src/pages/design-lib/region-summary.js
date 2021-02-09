const RegionSummary = () => {
  const regionType = "state"
  return (
    <div>
      <div className="max-w-lg rounded border border-gray-300 p-2">
        {regionType == "state" ?
        <div>
          <div className="flex justify-center mt-8">Semicircle/Circle</div>
          <div className="flex justify-between mx-4 my-6">
            <div className="grid justify-items-center ">
              <div className="w-10 h-2" style={{backgroundColor: "#f97d09"}}></div>
              <div>BJP</div>
            </div>
            <div className="grid justify-items-center ">
              <div className="w-10 h-2" style={{backgroundColor: "#bd0026"}}></div>
              <div>BSP</div>
            </div>
            <div className="grid justify-items-center ">
              <div className="w-10 h-2" style={{backgroundColor: "#138808"}}></div>
              <div>INC</div>
            </div>
            <div className="grid justify-items-center ">
              <div className="w-10 h-2" style={{backgroundColor: "#333"}}></div>
              <div>IND</div>
            </div>
            <div className="grid justify-items-center ">
              <div className="w-10 h-2" style={{backgroundColor: "#a6a6a6"}}></div>
              <div>Others</div>
            </div>
          </div>
        </div>
        :
        <div className="text-center my-8">BJP</div>
        }
        {regionType == "state" ? 
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
         : 
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
         }
      </div>
    </div>
  )
}

export default RegionSummary
