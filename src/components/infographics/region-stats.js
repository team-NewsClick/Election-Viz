import parliamentSVG from 'parliament-svg'
import stringify from 'virtual-dom-stringify'
import parse from 'html-react-parser'

const RegionStats = () => {
  const data = {
    NDA: {
      seats: 78,
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
    <div className="bg-gray-50 rounded border border-gray-300 py-0.5 lg:pt-8 px-2 md:px-6 heightImp100">
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
      <div className="text-sm md:text-base">
        <div className="flex bg-gray-300 border-b border-gray-500 font-semibold">
          <div className="w-2/12 border-r border-gray-500 px-1 py-2"></div>
          <div className="w-3/12 px-1 py-2 text-center">Seats Won</div>
          <div className="w-2/12 px-3 border-r border-gray-500 py-2">
            <img src="img/plus-minus.svg" className="float-right" />
          </div>
          <div className="w-3/12 px-1 py-2 text-center">Votes% Won</div>
          <div className="w-2/12 px-3 py-2">
            <img src="img/plus-minus.svg" className="float-right" />
          </div>
        </div>
        <div className="flex bg-gray-200 border-b border-gray-500">
          <div className="w-2/12 border-r border-gray-500 pl-1.5 py-2">
            AITC
          </div>
          <div className="w-3/12 px-1 py-2 text-center">211</div>
          <div className="flex flex-row-reverse w-2/12 border-r border-gray-500 py-2 px-3">
            <div className="w-5/6 text-right">47</div>
            <img src="img/down-red.svg" className="w-4 mr-2" />
          </div>
          <div className="w-3/12 px-1 py-2 text-center">45.04</div>
          <div className="flex flex-row-reverse w-2/12 py-2 px-3">
            <div className="w-5/6 text-right">1.30</div>
            <img src="img/down-red.svg" className="w-4 mr-2" />
          </div>
        </div>
        <div className="flex bg-gray-200 border-b border-gray-500">
          <div className="w-2/12 border-r border-gray-500 pl-1.5 py-2">CPM</div>
          <div className="w-3/12 px-1 py-2 text-center">26</div>
          <div className="flex flex-row-reverse w-2/12 border-r border-gray-500 py-2 px-3">
            <div className="w-5/6 text-right">35</div>
            <img src="img/up-green.svg" className="w-4 mr-2" />
          </div>
          <div className="w-3/12 px-1 py-2 text-center">19.82</div>
          <div className="flex flex-row-reverse w-2/12 py-2 px-3">
            <div className="w-5/6 text-right">6.62</div>
            <img src="img/up-green.svg" className="w-4 mr-2" />
          </div>
        </div>
        <div className="flex bg-gray-200 border-b border-gray-500">
          <div className="w-2/12 border-r border-gray-500 pl-1.5 py-2">BJP</div>
          <div className="w-3/12 px-1 py-2 text-center">3</div>
          <div className="flex flex-row-reverse w-2/12 border-r border-gray-500 py-2 px-3">
            <div className="w-5/6 text-right">2</div>
            <img src="img/up-green.svg" className="w-4 mr-2" />
          </div>
          <div className="w-3/12 px-1 py-2 text-center">10.18</div>
          <div className="flex flex-row-reverse w-2/12 py-2 px-3">
            <div className="w-5/6 text-right">13.44</div>
            <img src="img/up-green.svg" className="w-4 mr-2" />
          </div>
        </div>
        <div className="flex bg-gray-200 border-b border-gray-500">
          <div className="w-2/12 border-r border-gray-500 pl-1.5 py-2">RSP</div>
          <div className="w-3/12 px-1 py-2 text-center">3</div>
          <div className="flex flex-row-reverse w-2/12 border-r border-gray-500 py-2 px-3">
            <div className="w-5/6 text-right">1</div>
            <img src="img/down-red.svg" className="w-4 mr-2" />
          </div>
          <div className="w-3/12 px-1 py-2 text-center">1.67</div>
          <div className="flex flex-row-reverse w-2/12 py-2 px-3">
            <div className="w-5/6 text-right">0.93</div>
            <img src="img/down-red.svg" className="w-4 mr-2" />
          </div>
        </div>
        <div className="flex bg-gray-200 border-b border-gray-500">
          <div className="w-2/12 border-r border-gray-500 pl-1.5 py-2">
            GOJAM
          </div>
          <div className="w-3/12 px-1 py-2 text-center">2</div>
          <div className="flex flex-row-reverse w-2/12 border-r border-gray-500 py-2 px-3">
            <div className="w-5/6 text-right">2</div>
            <img src="img/up-green.svg" className="w-4 mr-2" />
          </div>
          <div className="w-3/12 px-1 py-2 text-center">0.47</div>
          <div className="flex flex-row-reverse w-2/12 py-2 px-3">
            <div className="w-5/6 text-right">2.41</div>
            <img src="img/up-green.svg" className="w-4 mr-2" />
          </div>
        </div>
        <div className="flex bg-gray-200 border-b border-gray-500">
          <div className="w-2/12 border-r border-gray-500 pl-1.5 py-2">
            AIFB
          </div>
          <div className="w-3/12 px-1 py-2 text-center">1</div>
          <div className="flex flex-row-reverse w-2/12 border-r border-gray-500 py-2 px-3">
            <div className="w-5/6 text-right">1</div>
            <img src="img/down-red.svg" className="w-4 mr-2" />
          </div>
          <div className="w-3/12 px-1 py-2 text-center">2.83</div>
          <div className="flex flex-row-reverse w-2/12 py-2 px-3">
            <div className="w-5/6 text-right">1.05</div>
            <img src="img/up-green.svg" className="w-4 mr-2" />
          </div>
        </div>
        <div className="flex bg-gray-200 border-b border-gray-500">
          <div className="w-2/12 border-r border-gray-500 pl-1.5 py-2">IND</div>
          <div className="w-3/12 px-1 py-2 text-center">1</div>
          <div className="flex flex-row-reverse w-2/12 border-r border-gray-500 py-2 px-3">
            <div className="w-5/6 text-right">1</div>
            <img src="img/up-green.svg" className="w-4 mr-2" />
          </div>
          <div className="w-3/12 px-1 py-2 text-center">1.89</div>
          <div className="flex flex-row-reverse w-2/12 py-2 px-3">
            <div className="w-5/6 text-right">4.11</div>
            <img src="img/down-red.svg" className="w-4 mr-2" />
          </div>
        </div>
        <div className="flex bg-gray-200 border-b border-gray-500">
          <div className="w-2/12 border-r border-gray-500 pl-1.5 py-2">
            Others
          </div>
          <div className="w-3/12 px-1 py-2 text-center">3</div>
          <div className="flex flex-row-reverse w-2/12 border-r border-gray-500 py-2 px-3">
            <div className="w-5/6 text-right">2</div>
            <img src="img/up-green.svg" className="w-4 mr-2" />
          </div>
          <div className="w-3/12 px-1 py-2 text-center">12.29</div>
          <div className="flex flex-row-reverse w-2/12 py-2 px-3">
            <div className="w-5/6 text-right">30.42</div>
            <img src="img/up-green.svg" className="w-4 mr-2" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegionStats
