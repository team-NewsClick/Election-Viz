import axios from "axios"
import { REGION_DEFAULT_SELECT, ALL_STATE_UT } from "../constants"

let allRegions = {}
axios
  .get(`/data/json/regions.json`)
  .then((response) => (allRegions = response.data))
  .catch((e) => (allRegions = {}))

/**
 * List of regions iin the state/UT
 * @param {String} stateUT Name of selected state/UT
 * @returns List of regions iin the state/UT
 */
export const getRegions = (stateUT) => {
  let regionOptions = [REGION_DEFAULT_SELECT]
  if (stateUT === ALL_STATE_UT) return regionOptions
  for (const region in allRegions[stateUT]) {
    regionOptions.push(region)
  }
  return regionOptions
}

/**
 * List of districts in the region of the state/UT
 * @param {String} stateUT Name of selected state/UT
 * @param {String} region Name of selected region in a state/UT
 * @returns List of districts in the region of the state/UT
 */
export const getDistricts = (stateUT, region) => {
  return allRegions[stateUT] ? allRegions[stateUT][region] : []
}
