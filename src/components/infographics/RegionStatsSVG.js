import parliamentSVG from 'parliament-svg'
import stringify from 'virtual-dom-stringify'
import parse from 'html-react-parser'
import { constituenciesDefaultSelect } from "../../constants"

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

  return (
    <div>
      {totalConstituencies > 2 ? (
        <div>
          <div className="max-w-3xl px-4 pt-5">{parse(semicircle)}</div>
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
            selectedConstituency == constituenciesDefaultSelect && <div className="text-4xl text-center pt-12">{totalConstituencies}</div> :
            <div className="text-2xl text-center md:pt-24 pt-32">Please Select a State/UT or a Constituency for a Detailed View</div>}
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
