/**
 * To get the params required for sliders for the alliances' swings
 * @param {Array<Strings>} arr name of alliances
 * @returns {Array<Object>} required params for html-id, initial swing as 0 for sliders
 */
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

/**
 * To get the params required for sliders for the alliances' swings
 * @param {Array<Object>} arr party and therir respective alliances
 * @returns {Array<Object>} required params for html-id, initial swing as 0 for sliders
 */
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
