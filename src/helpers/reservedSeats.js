export const getReservedGeoJson = (geoJson, seatType, electionType) => {
    if(electionType === "general") {
        const filteredGeoJson = geoJson.features.filter((d) => {
            if(seatType === "Unreserved"){
                return d.properties.Res === "GEN"
            } else {
                return d.properties.Res !== "GEN"
            }
        })
        return {
            type: geoJson.type,
            name: geoJson.name,
            crs: geoJson.crs,
            features: filteredGeoJson,
        }
    } else {
        return geoJson
    }
}