import { SEAT_DEFAULT_SELECT } from "../constants"

/**
 * To filter GeoJSON with respect   to seatType
 * @param {Object} geoJson Constituencies GeoJSON
 * @param {String} seatType All Seats/Reserved/Unreserved
 * @param {String} electionType assembly/general
 * @returns {Object} - Filtered GeoJson with respect to seatType
 */
export const getReservedGeoJson = (geoJson, seatType) => {
  if (seatType !== SEAT_DEFAULT_SELECT) {
    const filteredGeoJson = geoJson.features.filter((d) => {
      if (seatType === "Unreserved") {
        return d.properties.Res === "GEN"
      } else {
        return d.properties.Res !== "GEN"
      }
    })
    return {
      type: geoJson.type,
      name: geoJson.name,
      crs: geoJson.crs,
      features: filteredGeoJson
    }
  } else {
    return geoJson
  }
}
