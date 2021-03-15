import parliamentSVG from 'parliament-svg'
import stringify from 'virtual-dom-stringify'
import parse from 'html-react-parser'

const RegionStatsSVG = ({regionStatsSVGData}) => {
  console.log(regionStatsSVGData,'svg data')
  const data = {
    NDA: {
      seats: 10,
      colour: '#f97d09',
    },
    BSP: {
      seats: 11,
      colour: '#bd0026',
    },
    INC: {
      seats: 38,
      colour: '#138808',
    },
    IND: {
      seats: 6,
      colour: '#333',
    },
    Others: {
      seats: 4,
      colour: '#a6a6a6',
    },
  }
  const virtualNodeSemicircle = parliamentSVG(data, true)
  const semicircle = stringify(virtualNodeSemicircle)

  const regionType = 'state'
  const totalConstituencies = 137
  return (
    <div>
      {totalConstituencies > 2 ? (
        <div>
          <div className="max-w-3xl px-4 pt-5">{parse(semicircle)}</div>
        </div>
      ) : (
        <div className="flex justify-center h-64 mt-4">
          <svg height="100" width="100" className="m-auto">
            <circle cx="50" cy="50" r="50" fill="#f97d09" />
          </svg>
          <svg height="100" width="100" className="m-auto">
            <circle cx="50" cy="50" r="50" fill="#f97d09" />
          </svg>
        </div>
      )}
      {regionType == 'state' ? (
        <div className="lg:pb-2">
          <div className="flex  flex-wrap justify-between mx-4 mt-9 mb-10">
            <div className="grid justify-items-center px-0.5 py-1.5">
              <div
                className="w-10 h-2"
                style={{ backgroundColor: '#f97d09' }}
              ></div>
              <div>BJP</div>
            </div>
            <div className="grid justify-items-center px-0.5 py-1.5">
              <div
                className="w-10 h-2"
                style={{ backgroundColor: '#bd0026' }}
              ></div>
              <div>BSP</div>
            </div>
            <div className="grid justify-items-center px-0.5 py-1.5">
              <div
                className="w-10 h-2"
                style={{ backgroundColor: '#138808' }}
              ></div>
              <div>INC</div>
            </div>
            <div className="grid justify-items-center px-0.5 py-1.5">
              <div
                className="w-10 h-2"
                style={{ backgroundColor: '#333' }}
              ></div>
              <div>IND</div>
            </div>
            <div className="grid justify-items-center px-0.5 py-1.5">
              <div
                className="w-10 h-2"
                style={{ backgroundColor: '#a6a6a6' }}
              ></div>
              <div>Others</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center my-8">BJP</div>
      )}
    </div>
  )
}

export default RegionStatsSVG
