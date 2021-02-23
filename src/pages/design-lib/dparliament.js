// import dynamic from 'next/dynamic'

// const d3 = dynamic(() => import('d3'), { ssr: false })
// const d3parliament = dynamic(() => import('d3-parliament'), { ssr: false })

import * as d3 from 'd3'
import parliament from 'd3-parliament'

const DParliament = () => {
  const data = [
    {
      id: 'gue-ngl',
      legend: 'GUE-NGL',
      name: 'European United Left–Nordic Green Left',
      seats: 52,
    },
    {
      id: 'sd',
      legend: 'S&D',
      name: 'Progressive Alliance of Socialists and Democrats',
      seats: 189,
    },
    {
      id: 'greens-efa',
      legend: 'Greens-EFA',
      name: 'The Greens–European Free Alliance',
      seats: 50,
    },
    {
      id: 'alde',
      legend: 'ALDE',
      name: 'Alliance of Liberals and Democrats for Europe Group',
      seats: 70,
    },
    {
      id: 'epp',
      legend: 'EPP',
      name: "European People's Party Group",
      seats: 215,
    },
    {
      id: 'ecr',
      legend: 'ECR',
      name: 'European Conservatives and Reformists',
      seats: 74,
    },
    {
      id: 'efdd',
      legend: 'EFDD',
      name: 'Europe of Freedom and Direct Democracy',
      seats: 46,
    },
    {
      id: 'enf',
      legend: 'ENF',
      name: 'Europe of Nations and Freedom',
      seats: 39,
    },
    {
      id: 'no-party',
      legend: 'Non-Inscrits',
      name: 'Non-Inscrits',
      seats: 16,
    },
  ]
  const width = 400
  const height = 200
  const svg = d3.select('svg').attr('width', width).attr('height', height)
  const parliament = d3parliament
  // console.log(parliament.render)
  // parliament.width(500).height(500).innerRadiusCoef(0.4)
  // parliament.enter.fromCenter(true).smallToBig(true)
  // parliament.exit.toCenter(false).bigToSmall(true)

  // // /* register event listeners */
  // parliament.on('click', function (d) {
  //   alert('You clicked on a seat of ' + d.party.name)
  // })
  // parliament.on('mouseover', function (d) {
  //   console.log('mouse on ' + d.party.name)
  // })
  // parliament.on('mouseout', function (d) {
  //   console.log('mouse out of ' + d.party.name)
  // })

  // // /* add the parliament to the page */
  // d3.json('data', function (d) {
  //   d3.select('svg').datum(d).call(parliament)
  // })

  return (
    <div>
      <div></div>
      {console.log('parliament: ', parliament)}
    </div>
  )
}

export default DParliament
