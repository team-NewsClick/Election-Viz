import {
  REGION_DEFAULT_SELECT,
  SEAT_DEFAULT_SELECT,
  SELECT_STATE_UT,
  ALL_STATE_UT
} from "../constants"
import { getDistricts } from "../helpers/regions"

/**
 * To filter GeoJSON
 * @param {GeoJSON} geoJson Constituencies GeoJSON
 * @param {Array<String>} stateUTOptions List of state/UT options to be selected
 * @param {String} seatType All Seats/Reserved/Unreserved
 * @param {String} selectedStateUT Name of selected state/UT
 * @param {String} selectedRegion Name of selected region in a state/UT
 * @returns {GeoJSON} - Filtered GeoJson
 */
export const getFilteredGeoJson = (
  geoJson,
  seatType,
  stateUTOptions,
  selectedStateUT,
  selectedRegion
) => {
  let filteredBySeatGeoJson = [],
    filteredByRegionGeoJSON = [],
    filteredByStateGeoJSON = [],
    districts = []
  if (geoJson.length !== 0) {
    if (
      selectedStateUT === ALL_STATE_UT ||
      selectedStateUT === SELECT_STATE_UT
    ) {
      geoJson.features.findIndex((d) => {
        const tempBoolean =
          d.properties.ST_NAME ===
          stateUTOptions.find((st) => st === d.properties.ST_NAME)
        if (tempBoolean) filteredByStateGeoJSON.push(d)
      })
    } else {
      filteredByStateGeoJSON = geoJson.features.filter(
        (d) => d.properties.ST_NAME === selectedStateUT
      )
    }
  }
  switch (seatType) {
    case "Reserved":
      filteredBySeatGeoJson = filteredByStateGeoJSON.filter(
        (d) => d.properties.RES !== "GEN"
      )
      break
    case "Unreserved":
      filteredBySeatGeoJson = filteredByStateGeoJSON.filter(
        (d) => d.properties.RES === "GEN"
      )
      break
    default:
      filteredBySeatGeoJson = filteredByStateGeoJSON
  }
  if (selectedRegion === REGION_DEFAULT_SELECT) {
    filteredByRegionGeoJSON = filteredBySeatGeoJson
  } else {
    districts = getDistricts(selectedStateUT, selectedRegion)
    filteredByRegionGeoJSON = filteredBySeatGeoJson.filter((d) => {
      if (
        districts &&
        districts.findIndex((e) => e === d.properties.DIST_NAME) >= 0
      ) {
        return d
      }
    })
  }
  return {
    type: geoJson.type,
    name: geoJson.name,
    crs: geoJson.crs,
    features: filteredByRegionGeoJSON
  }
}
