import axios from "axios"
import { REGION_DEFAULT_SELECT, ALL_STATE_UT } from "../constants"

let allRegions = {}
axios
  .get(`/data/json/regions.json`)
  .then((response) => allRegions  = response.data)
  .catch((e) => allRegions = {})

export const getRegions = (stateUT) => {
  let regionOptions = [REGION_DEFAULT_SELECT]
  if (stateUT === ALL_STATE_UT) return regionOptions
  for(const region in allRegions[stateUT]) {
    regionOptions.push(region)
  }
  return regionOptions
}

export const getDistricts = (stateUT, region) => {
  let districts
  if(allRegions[stateUT]) {
    districts = allRegions[stateUT][region]
  } else {
    districts = []
  }
  return districts
}
