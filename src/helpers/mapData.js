import {
  DEFAULT_PARTY_ALLIANCE_COLOR,
  ALL_CONSTITUENCIES,
  FIRST_SELECT_STATEUT,
  NO_CONSTITUENCIES
} from "../constants"

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

/**
 * List of Constituencies and their winning candidates data
 * @param {Object} data {StateUT, PC_NAME, Top 4 contestants}
 * @param {String} selectedConstituency Name of Selected Constituency
 * @returns {Array<Object>} - List of selected constituencies with respective winner data
 */
 export const getConstituenciesResults = (
  data,
  selectedStateUT,
  selectedConstituency,
  electionViewType,
  groupType,
  partyAlliance,
  colorPartyAlliance
) => {
  if(colorPartyAlliance) {
    let result = {}
    if (data != {} &&
      selectedConstituency !== undefined) {
      if (
        selectedConstituency === ALL_CONSTITUENCIES ||
        selectedConstituency === FIRST_SELECT_STATEUT ||
        selectedConstituency === NO_CONSTITUENCIES
      ) {
        if(electionViewType === "general") {
          if(groupType === "party") {
            for(const stateUT in data) {
              const stateUTData = {}
              for(const constituency in data[stateUT]) {
                stateUTData[constituency] = {
                  candidate: data[stateUT][constituency][0].candidate,
                  party: data[stateUT][constituency][0].party,
                  color: data[stateUT][constituency][0].color
                }
              }
              result[stateUT] = stateUTData
            }
          } else {
            for(const stateUT in data) {
              const stateUTData = {}
              for(const constituency in data[stateUT]) {
                const party = data[stateUT][constituency][0].party
                const allianceIndex = partyAlliance.findIndex((d) => d.PARTY === party)
                const alliance = allianceIndex > -1 ? partyAlliance[allianceIndex].ALLIANCE : ""
                const color = colorPartyAlliance[alliance] ? colorPartyAlliance[alliance] : DEFAULT_PARTY_ALLIANCE_COLOR
                stateUTData[constituency] = {
                  candidate: data[stateUT][constituency][0].candidate,
                  alliance: alliance,
                  color: color
                }
              }
              result[stateUT] = stateUTData
            }
          }
        } else {
          if(groupType === "party") {
            for(const stateUT in data) {
              const stateUTData = {}
              for(const constituency in data[stateUT]) {
                stateUTData[constituency] = {
                  candidate: data[stateUT][constituency][0].candidate,
                  party: data[stateUT][constituency][0].party,
                  color: data[stateUT][constituency][0].color
                }
              }
              result[stateUT] = stateUTData
            }
          } else {
            for(const stateUT in data) {
              const stateUTData = {}
              for(const constituency in data[stateUT]) {
                const party = data[stateUT][constituency][0].party
                const allianceIndex = partyAlliance.findIndex((d) => d.PARTY === party)
                const alliance = allianceIndex > -1 ? partyAlliance[allianceIndex].ALLIANCE : ""
                const color = colorPartyAlliance[alliance] ? colorPartyAlliance[alliance] : DEFAULT_PARTY_ALLIANCE_COLOR
                stateUTData[constituency] = {
                  candidate: data[stateUT][constituency][0].candidate,
                  alliance: alliance,
                  color: color
                }
              }
              result[stateUT] = stateUTData
            }
          }
        }
      } else {
        if(data[selectedStateUT] && data[selectedStateUT][selectedConstituency] && data[selectedStateUT][selectedConstituency][0]) {
          result[selectedStateUT] = {}
          result[selectedStateUT][selectedConstituency] = []
          if(electionViewType === "general") {
            if(groupType === "party") {
              result[selectedStateUT][selectedConstituency] = {
                  candidate: data[selectedStateUT][selectedConstituency][0].candidate,
                  party: data[selectedStateUT][selectedConstituency][0].party,
                  color: data[selectedStateUT][selectedConstituency][0].color,
                }
            } else {
              const party = data[selectedStateUT][selectedConstituency][0].party
              const allianceIndex = partyAlliance.findIndex((d) => d.PARTY === party)
              const alliance = allianceIndex > -1 ? partyAlliance[allianceIndex].ALLIANCE : ""
              const color = colorPartyAlliance[alliance] ? colorPartyAlliance[alliance] : DEFAULT_PARTY_ALLIANCE_COLOR
              result[selectedStateUT][selectedConstituency] = {
                  candidate: data[selectedStateUT][selectedConstituency][0].candidate,
                  alliance: alliance,
                  color: color,
                }
            }
          } else {
            if(groupType === "party") {
              result[selectedStateUT][selectedConstituency] = {
                  candidate: data[selectedStateUT][selectedConstituency][0].candidate,
                  party: data[selectedStateUT][selectedConstituency][0].party,
                  color: data[selectedStateUT][selectedConstituency][0].color,
                }
            } else {
              const party = data[selectedStateUT][selectedConstituency][0].party
              const allianceIndex = partyAlliance.findIndex((d) => d.PARTY === party)
              const alliance = allianceIndex > -1 ? partyAlliance[allianceIndex].ALLIANCE : ""
              const color = colorPartyAlliance[alliance] ? colorPartyAlliance[alliance] : DEFAULT_PARTY_ALLIANCE_COLOR
              result[selectedStateUT][selectedConstituency] = {
                  candidate: data[selectedStateUT][selectedConstituency][0].candidate,
                  alliance: alliance,
                  color: color,
                }
            }
          }
        }
      }
      return result
    } else {
      return {}
    }
  }
}