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
  let result = {}, stateData = [], stateUTList
    stateUTList = stateUTOptions.slice(1)
  if (Object.keys(colorPartyAlliance).length !== 0) {
    if (electionViewType === "general") {
      stateUTList.map((stateUT) => {
        stateData = data.filter((stateUTRow) => stateUTRow.ST_NAME === stateUT)
        let constituenciesList = new Set()
        stateData.map((row) => {
          constituenciesList.add(row.PC_NO)
        })
        let constituencies = {}
        constituenciesList = [...constituenciesList]
        constituenciesList.map((pc) => {
          let constituencyData = stateData.filter((row) => row.PC_NO === pc)
          let candidates = new Set()
          constituencyData.map((row) => candidates.add(row.CANDIDATE))
          let constituencyStatsTemp = [...candidates].map((c) => {
            let votesReceived = 0
            let candidate = null
            let party = null
            constituencyData.map((row) => {
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
          constituencies[pc] = constituencyStats
        })
        result[stateUT] = constituencies
      })
    } else {
      stateUTList.map((stateUT) => {
        stateData = data.filter((stateUTRow) => stateUTRow.ST_NAME === stateUT)
        let constituenciesList = new Set()
        stateData.map((row) => {
          constituenciesList.add(row.AC_NO)
        })
        let constituencies = {}
        constituenciesList = [...constituenciesList]
        constituenciesList.map((ac) => {
          let constituencyData = stateData.filter((row) => row.AC_NO === ac)
          let candidates = new Set()
          constituencyData.map((row) => candidates.add(row.CANDIDATE))
          let constituencyStatsTemp = [...candidates].map((c) => {
            let votesReceived = 0
            let candidate = null
            let party = null
            constituencyData.map((row) => {
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
          constituencies[ac] = constituencyStats
        })
        result[stateUT] = constituencies
      })
    }
  }
  return result
}
