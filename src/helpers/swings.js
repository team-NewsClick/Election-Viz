export const addParams = (arr) => {
  const arrParams = arr.map((d, index) => {
    return {
      alliance: d,
      inputId: "input_" + d,
      sliderId: "slider_" + d,
      thumbId: "thumb_" + d,
      rangeId: "range_" + d,
      valueSwingDisaplyId: "valueSwingDisaply_" + d,
      swing: 0,
      newParty: false
    }
  })
  return arrParams
}

export const getParams = (partyAlliance) => {
  let alliances = new Set()
  partyAlliance && partyAlliance.map((d) => {
    alliances.add(d.ALLIANCE)
  })
  alliances.add("OTHERS")
  alliances = [...alliances]
  const params = addParams(alliances)
  return params
}
