import { filter } from "virtual-dom-stringify/lib/self-closing-tags"
import { REGION_DEFAULT_SELECT, SEAT_DEFAULT_SELECT, SELECT_STATE_UT, STATE_UT_DEFAULT_SELECT } from "../constants"
import { getDistricts } from "../helpers/regions"

/**
 * To filter GeoJSON with respect   to seatType
 * @param {Object} geoJson Constituencies GeoJSON
 * @param {String} seatType All Seats/Reserved/Unreserved
 * @param {String} electionViewType assembly/general
 * @returns {Object} - Filtered GeoJson with respect to seatType
 */
export const getFilteredGeoJson = (
  geoJson,
  seatType,
  selectedStateUT,
  selectedRegion
) => {
  let filteredBySeatGeoJson = [], filteredByRegionGeoJSON = [], filteredByStateGeoJSON = [], districts = []
  if(selectedStateUT === STATE_UT_DEFAULT_SELECT || selectedStateUT === SELECT_STATE_UT) {
    filteredByStateGeoJSON = geoJson.features
  } else {
    filteredByStateGeoJSON = geoJson.features.filter((d) => d.properties.ST_NAME === selectedStateUT)
  }
  if (seatType !== SEAT_DEFAULT_SELECT) {
    filteredBySeatGeoJson = filteredByStateGeoJSON.filter((d) => {
      if (seatType === "Unreserved") {
        return d.properties.Res === "GEN"
      } else {
        return d.properties.Res !== "GEN"
      }
    })
  } else {
    filteredBySeatGeoJson = filteredByStateGeoJSON
  }
  if (selectedRegion === REGION_DEFAULT_SELECT) {
    filteredByRegionGeoJSON = filteredBySeatGeoJson
  } else {
    districts = getDistricts(selectedStateUT, selectedRegion)
    filteredByRegionGeoJSON = filteredBySeatGeoJson.filter((d) => {
      if (districts.findIndex((e) => e === d.properties.DIST_NAME) >= 0) {
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
