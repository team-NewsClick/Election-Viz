import parliamentSVG from "parliament-svg"
import stringify from "virtual-dom-stringify"
import parse from 'html-react-parser'

const ParliamentSVG = () => {
  const parties = {
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
  const virtualNodeSemicircle = parliamentSVG(parties, true)
  const semicircle = stringify(virtualNodeSemicircle)

  return (
    <div id="demo-target">
      <div className="max-w-3xl">{parse(semicircle)}</div>
    </div>
  )
}

export default ParliamentSVG
