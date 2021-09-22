import {
  DEFAULT_PARTY_ALLIANCE_COLOR,
  ALL_CONSTITUENCIES,
  FIRST_SELECT_STATEUT,
  NO_CONSTITUENCIES,
  LIVE_ELECTION,
  NA_ALLIANCE_DATA,
  NA_PARTY_DATA
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
export const getContestantStats = (
  data,
  stateUTOptions,
  electionViewType,
  partyAlliance,
  colorPartyAlliance,
  selectedElection,
  groupType,
  selectedStateUT,
  filteredGeoJSON
) => {
  let result = {}, stateUTList
  const stateConstituenciesData = {}
  if (data.length !== 0 || (selectedElection && selectedElection.year === LIVE_ELECTION)) {
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
        let constituencyStatsTemp = stateConstituenciesData[stateUT][constituency].map((row) => {
          return {
            candidate : row.CANDIDATE,
            party: row.PARTY,
            votesReceived: parseInt(row.VOTES),
            color: colorPartyAlliance[row.PARTY]
              ? colorPartyAlliance[row.PARTY]
              : DEFAULT_PARTY_ALLIANCE_COLOR,
          }
        })
        if(groupType === "alliance") {
          let tempAllianceStats = []
          constituencyStatsTemp.map((d) => {
            const allianceIndex = partyAlliance.findIndex((i) => i.PARTY === d.party)
            const alliance = allianceIndex > -1 ? partyAlliance[allianceIndex].ALLIANCE : d.party
            const tempAllianceStatsIndex = tempAllianceStats.findIndex((i) => i.alliance === alliance)
            tempAllianceStatsIndex > -1
              ? tempAllianceStats[tempAllianceStatsIndex].votesReceived += d.votesReceived
              : tempAllianceStats.push({
                candidate: alliance,
                alliance,
                votesReceived:d.votesReceived,
                color: colorPartyAlliance[alliance] ? colorPartyAlliance[alliance] : DEFAULT_PARTY_ALLIANCE_COLOR
              })
          })
          constituencyStatsTemp = tempAllianceStats
        }
        let constituencyStatsSorted = constituencyStatsTemp.sort((a, b) => {
          return (parseInt(b.votesReceived) - parseInt(a.votesReceived))
        })
        let constituencyStats = []
        constituencyStatsSorted.length < 5 && (constituencyStats = constituencyStatsSorted)
        constituencyStatsSorted.length >= 5 && constituencyStatsSorted.map((row, index) => {
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
    if(groupType === "party") {
      if(selectedStateUT !== undefined && selectedElection && selectedElection.year === LIVE_ELECTION) {
        if(electionViewType === "general") {
          filteredGeoJSON.features.map((d) => {
            result[selectedStateUT][d.properties.PC_NO] = result[selectedStateUT][d.properties.PC_NO]
              ? result[selectedStateUT][d.properties.PC_NO]
              : result[selectedStateUT][d.properties.PC_NO] = [NA_PARTY_DATA]
          })
        } else {
          filteredGeoJSON.features.map((d) => {
            result[selectedStateUT][d.properties.AC_NO] = result[selectedStateUT][d.properties.AC_NO]
              ? result[selectedStateUT][d.properties.AC_NO]
              : result[selectedStateUT][d.properties.AC_NO] = [NA_PARTY_DATA]
          })
        }
      }
    } else {
      if(selectedStateUT !== undefined && selectedElection && selectedElection.year === LIVE_ELECTION) {
        if(electionViewType === "general") {
          filteredGeoJSON.features.map((d) => {
            result[selectedStateUT][d.properties.PC_NO] = result[selectedStateUT][d.properties.PC_NO]
              ? result[selectedStateUT][d.properties.PC_NO]
              : result[selectedStateUT][d.properties.PC_NO] = [NA_ALLIANCE_DATA]
          })
        } else {
          filteredGeoJSON.features.map((d) => {
            result[selectedStateUT][d.properties.AC_NO] = result[selectedStateUT][d.properties.AC_NO]
              ? result[selectedStateUT][d.properties.AC_NO]
              : result[selectedStateUT][d.properties.AC_NO] = [NA_ALLIANCE_DATA]
          })
        }
      }
    }
  }
  return result
}

export const getMapData = (
  data,
  stateUTOptions,
  electionViewType,
  partyAlliance,
  colorPartyAlliance,
  selectedElection,
  selectedStateUT,
  filteredGeoJSON
) => {
  const mapData = getContestantStats(
    data,
    stateUTOptions,
    electionViewType,
    partyAlliance,
    colorPartyAlliance,
    selectedElection,
    "party",
    selectedStateUT,
    filteredGeoJSON,
  )
  return mapData
}

/**
 * List of Constituencies and their winning candidates data
 * @param {Object} mapData {StateUT, PC_NAME, Top 4 contestants}
 * @param {String} selectedConstituency Name of Selected Constituency
 * @returns {Array<Object>} - List of selected constituencies with respective winner data
 */
 export const getConstituenciesResults = (
  data,
  electionViewType,
  selectedElection,
  stateUTOptions,
  selectedStateUT,
  selectedConstituency,
  groupType,
  partyAlliance,
  colorPartyAlliance,
  filteredGeoJSON
) => {
  let result = {}, mapData
  mapData = getContestantStats(
    data,
    stateUTOptions,
    electionViewType,
    partyAlliance,
    colorPartyAlliance,
    selectedElection,
    groupType,
    selectedStateUT,
    filteredGeoJSON
  )
  if(colorPartyAlliance && mapData != {} && selectedConstituency !== undefined) {
    if (selectedConstituency === ALL_CONSTITUENCIES
      || selectedConstituency === NO_CONSTITUENCIES
      || selectedConstituency === FIRST_SELECT_STATEUT
      ) {
      if(groupType === "party") {
        for(const stateUT in mapData) {
          const stateUTData = {}
          for(const constituency in mapData[stateUT]) {
            mapData[stateUT][constituency][0].votesReceived > 0
              ? stateUTData[constituency] = {
                candidate: mapData[stateUT][constituency][0].candidate,
                party: mapData[stateUT][constituency][0].party,
                color: mapData[stateUT][constituency][0].color
              }
              : stateUTData[constituency] = NA_PARTY_DATA            
          }
          result[stateUT] = stateUTData
        }
      } else {
        for(const stateUT in mapData) {
          const stateUTData = {}
          for(const constituency in mapData[stateUT]) {
            mapData[stateUT][constituency][0].votesReceived > 0
              ? stateUTData[constituency] = {
                candidate: mapData[stateUT][constituency][0].candidate,
                alliance: mapData[stateUT][constituency][0].alliance,
                color: mapData[stateUT][constituency][0].color
              }
              : stateUTData[constituency] = NA_ALLIANCE_DATA
            }
            result[stateUT] = stateUTData
        }
      }
    }
    else {
      const stateUTData = {}
      result[selectedStateUT] = {}
      result[selectedStateUT][selectedConstituency] = {}
      if(mapData[selectedStateUT]
        && mapData[selectedStateUT][selectedConstituency]
        && mapData[selectedStateUT][selectedConstituency][0]
        && mapData[selectedStateUT][selectedConstituency][0].votesReceived > 0
        ) {
        groupType === "party"
          ? result[selectedStateUT][selectedConstituency] = {
              candidate: mapData[selectedStateUT][selectedConstituency][0].candidate,
              party: mapData[selectedStateUT][selectedConstituency][0].party,
              color: mapData[selectedStateUT][selectedConstituency][0].color,
            }
          : result[selectedStateUT][selectedConstituency] = {
              candidate: mapData[selectedStateUT][selectedConstituency][0].candidate,
              alliance: mapData[selectedStateUT][selectedConstituency][0].alliance,
              color: mapData[selectedStateUT][selectedConstituency][0].color,
            }
      } else {
        groupType === "party"
          ? result[selectedStateUT][selectedConstituency] = NA_PARTY_DATA
          : result[selectedStateUT][selectedConstituency] = NA_ALLIANCE_DATA
      }
    }                              
    return result
  } else {
    return {}
  }
}
