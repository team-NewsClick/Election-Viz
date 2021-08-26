import { ALL_STATE_UT, DEFAULT_PARTY_ALLIANCE_COLOR } from "../constants"

/**
 * Returns Data for Map as a List of Constituencies in a State/UT and top four candidates in an Array respectively
 * @param {Array<Object>} data - Election Data of a year
 * @param {Array<String>} stateUTOptions - List od States & UTs
 * @param {String} stateUT - Key Name of a State/UT
 * @param {String} electionViewType - general or assembly
 * @param {Object} colorPartyAlliance - List Parties and Aliiances and their respective color
 * @return {Object} - List of Constituencies in a State/UT and top four candidates in an Array respectively
 */
export const getMapData = (
  data,
  stateUTOptions,
  electionViewType,
  colorPartyAlliance
) => {
  let result = {}, stateUTList
  const stateConstituenciesData = {}
  if (Object.keys(colorPartyAlliance).length !== 0 && data.length !== 0) {
    stateUTList = stateUTOptions.slice(1)
    stateUTList.map((d) => stateConstituenciesData[d] = {})
    if (electionViewType === "general") {
      data.map((d) => {
        if(stateConstituenciesData[d.ST_NAME] && stateConstituenciesData[d.ST_NAME][d.PC_NO]) {
          stateConstituenciesData[d.ST_NAME][d.PC_NO].push(d)
        } else if(stateConstituenciesData[d.ST_NAME]) {
          stateConstituenciesData[d.ST_NAME][d.PC_NO] = []
          stateConstituenciesData[d.ST_NAME][d.PC_NO].push(d)
        } else {
          stateConstituenciesData[d.ST_NAME] = {}
          stateConstituenciesData[d.ST_NAME][d.PC_NO] = []
          stateConstituenciesData[d.ST_NAME][d.PC_NO].push(d)
        }
      })
    } else {
      data.map((d) => {
        if(stateConstituenciesData[d.ST_NAME] && stateConstituenciesData[d.ST_NAME][d.AC_NO]) {
          stateConstituenciesData[d.ST_NAME][d.AC_NO].push(d)
        } else if(stateConstituenciesData[d.ST_NAME]){
          stateConstituenciesData[d.ST_NAME][d.AC_NO] = []
          stateConstituenciesData[d.ST_NAME][d.AC_NO].push(d)
        } else {
          stateConstituenciesData[d.ST_NAME] = {}
          stateConstituenciesData[d.ST_NAME][d.AC_NO] = []
          stateConstituenciesData[d.ST_NAME][d.AC_NO].push(d)
        }
      })
    }
    for(const stateUT in stateConstituenciesData) {
      let constituencies = {}
      for(const constituency in stateConstituenciesData[stateUT]) {
        let candidates = new Set()
        stateConstituenciesData[stateUT][constituency].map((row) => candidates.add(row.CANDIDATE))
        let constituencyStatsTemp = [...candidates].map((c) => {
          let votesReceived = 0
          let candidate = null
          let party = null
          stateConstituenciesData[stateUT][constituency].map((row) => {
            row.CANDIDATE === c &&
              ((candidate = c),
              (party = row.PARTY),
              (votesReceived = votesReceived + parseInt(row.VOTES)))
          })
          return {
            candidate: candidate,
            party: party,
            votesReceived: votesReceived,
            color: colorPartyAlliance[party]
              ? colorPartyAlliance[party]
              : DEFAULT_PARTY_ALLIANCE_COLOR,
          }
        })
        let constituencyStatsSorted = constituencyStatsTemp.sort((a, b) => {
          return (a.votesReceived > b.votesReceived && -1) || 1
        })
        let constituencyStats = []
        constituencyStatsSorted.length < 5 &&
        (constituencyStats = constituencyStatsSorted)
      constituencyStatsSorted.length >= 5 &&
        constituencyStatsSorted.map((row, index) => {
          ;(index < 4 && (constituencyStats[index] = row)) ||
            ((constituencyStats[3].candidate = "OTHERS"),
            (constituencyStats[3].party = "OTHERS"),
            (constituencyStats[3].votesReceived +=
              constituencyStatsSorted[index].votesReceived))
        })
      constituencies[constituency] = constituencyStats
        
      }
      result[stateUT] = constituencies
    }
  }
  return result
}
