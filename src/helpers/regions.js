import axios from "axios"
import { csvParse } from "d3-dsv"

import { REGION_DEFAULT_SELECT, STATE_UT_DEFAULT_SELECT } from "../constants"

let allRegions = []
axios
.get(`/data/csv/regions.csv`)
.then((response) => {
  const parsedData = csvParse(response.data)
  allRegions = parsedData
})
.catch((e) => allRegions = [])

export const getRegions = (stateUT) => {
  let regionOptions = new Set()
  regionOptions.add(REGION_DEFAULT_SELECT)

  if(stateUT === STATE_UT_DEFAULT_SELECT) return [...regionOptions]
  allRegions.map((d) => {
    if(d.ST_NAME === stateUT) regionOptions.add(d.REGION)
  })
  return [...regionOptions]
}

export const getDistricts = (stateUT, region) => {
  let  districts = new Set()
  const allDistricts = allRegions.filter((d) => d.ST_NAME === stateUT)
  allDistricts.map((d) => {
    if(d.REGION === region) {
      districts.add(d.DIST_NAME)
    }
  })
  return [...districts]
}