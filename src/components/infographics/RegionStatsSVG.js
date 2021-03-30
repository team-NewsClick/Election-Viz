import parliamentSVG from 'parliament-svg'
import stringify from 'virtual-dom-stringify'
import parse from 'html-react-parser'
import { CONSTITUENCIES_DEFAULT_SELECT } from "../../constants"
import Loading from "../Loading"

const RegionStatsSVG = ({regionStatsSVGData, selectedConstituency}) => {
  let altSVG = []
  let legends = []
  let totalConstituencies = 0
  for(const e in regionStatsSVGData) {
    totalConstituencies = totalConstituencies + regionStatsSVGData[e].seats
    legends.push({ party: e, colour: regionStatsSVGData[e].colour })
  }
  if(totalConstituencies <= 2){
    for(const e in regionStatsSVGData) {
      for(let i = 0; i <  regionStatsSVGData[e].seats; i++) {
        altSVG.push({fill: regionStatsSVGData[e] != undefined ? regionStatsSVGData[e].colour: "transparent"})
      }
    }
  }

  const data = regionStatsSVGData
  const virtualNodeSemicircle = totalConstituencies > 2 && parliamentSVG(data, true)
  const semicircle = totalConstituencies > 2 && stringify(virtualNodeSemicircle)

  return Object.keys(regionStatsSVGData).length == 0 ? <div className="h-1/2"><Loading /></div> : (
    <div>
      {totalConstituencies > 2 ? (
        <div>
          <div className="max-w-3xl px-4 pt-5 mx-auto">{parse(semicircle)}</div>
        </div>
      ) : (
        <div className="h-64 mt-4">
          <div className="flex justify-center">
          {altSVG.map((r, index) => 
            <svg key={index} height="100" width="100" className="m-auto">
              <circle cx="50" cy="50" r="50" fill={r.fill} />
            </svg>
          )}
          </div>
          {totalConstituencies > 0 ?
            selectedConstituency == CONSTITUENCIES_DEFAULT_SELECT && <div className="text-4xl text-center pt-12">{totalConstituencies}</div> :
            <div className="md:text-xl text-lg px-10 md:pt-60 pt-6">
              Please select a region for a detailed view. <br /><br />
              It's easy, you can try one of the following:<br /><br />
              <div className="pl-6">
                <ul style={{ listStyleType: "disc" }} >
                  <li>Click on the map</li>
                  <li>Select from the menu above</li>
                </ul>
              </div>
            </div>}
        </div>
      )}
        <div className="lg:pb-2">
          <div className="flex flex-wrap justify-center mx-4 mt-9 mb-10">
            {legends.map((row, index) => 
              <div key={index} className="grid justify-items-center px-2 py-1.5">
                <div
                  className="w-10 h-2"
                  style={{ backgroundColor: row.colour }}
                ></div>
                <div>{row.party}</div>
              </div>
            )}
          </div>
        </div>
    </div>
  )
}

export default RegionStatsSVG
