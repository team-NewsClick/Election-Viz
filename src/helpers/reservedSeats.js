import { REGION_DEFAULT_SELECT, SEAT_DEFAULT_SELECT } from "../constants"
import { getDistricts } from "../helpers/regions"

/**
 * To filter GeoJSON with respect   to seatType
 * @param {Object} geoJson Constituencies GeoJSON
 * @param {String} seatType All Seats/Reserved/Unreserved
 * @param {String} electionViewType assembly/general
 * @returns {Object} - Filtered GeoJson with respect to seatType
 */
export const getReservedGeoJson = (
  geoJson,
  seatType,
  selectedStateUT,
  selectedRegion
) => {
  let filteredBySeatGeoJson = []
  let filteredByRegionGeoJSON = []
  let districts = []
  if (seatType !== SEAT_DEFAULT_SELECT) {
    filteredBySeatGeoJson = geoJson.features.filter((d) => {
      if (seatType === "Unreserved") {
        return d.properties.Res === "GEN"
      } else {
        return d.properties.Res !== "GEN"
      }
    })
  } else {
    filteredBySeatGeoJson = geoJson.features
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
