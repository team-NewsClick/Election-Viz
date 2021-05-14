export const getReservedGeoJson = (geoJson, seatType) => {
    const filteredGeoJson = geoJson.features.filter((d) => {
        if(seatType === "Unreserved"){
            return d.properties.Res === "GEN"
        } else {
            return d.properties.Res !== "GEN"
        }
    })
    return {
        features: filteredGeoJson,
        crs: geoJson.crs,
        name: geoJson.name,
        type: geoJson.type
    }
}