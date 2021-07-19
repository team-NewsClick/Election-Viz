import {
  STATE_UT_DEFAULT_SELECT,
  CONSTITUENCIES_DEFAULT_SELECT
} from "../constants"
import {
  getConstituenciesResults,
  getDataConstituency,
  getMapData,
  getDataStateUT
} from "./utils"

/**
 * Calculate Data for selected region stats table
 * @param {Array<Object>} data Selected State or UT data
 * @param {object<Object>} SVGData Data for region stats SVG
 * @param {String} electionType general or assembly
 * @param {String} groupType party or alliance
 * @param {Array<Object>} partyAlliance party and their respective alliance
 * @param {String} selectedStateUT Selected State or UT
 * @param {String} selectedConstituency Selected Constituency
 * @returns {Array<Objects>} - Data of Party and their seats won, votes received, seats difference with respect to selected election to compare, percentage of votes received, difference of percentage of votes received with respect to last election
 */
export const getRegionStatsTable = (
  presentYearData,
  compareYearData,
  SVGData,
  electionType,
  compareElectionType,
  groupType,
  partyAlliance,
  selectedStateUT,
  selectedConstituency,
  mapDataConstituencies,
  filteredGeoJSON
) => {
  let tableData = []
  let presentYearDataTable = []
  let compareYearDataTable = []
  let filteredPresData = []
  let filteredCompareData = []

  if (electionType === "general") {
    filteredPresData = presentYearData.filter((d) => {
      if (
        filteredGeoJSON.features.findIndex(
          (e) => e.properties.PC_NAME === d.PC_NAME
        ) > -1
      ) {
        return d
      }
    })
    filteredCompareData = compareYearData.filter((d) => {
      if (
        filteredGeoJSON.features.findIndex(
          (e) => e.properties.PC_NAME === d.PC_NAME
        ) > -1
      ) {
        return d
      }
    })
  } else {
    filteredPresData = presentYearData.filter((d) => {
      if (
        filteredGeoJSON.features.findIndex(
          (e) => e.properties.AC_NAME === d.AC_NAME
        ) > -1
      ) {
        return d
      }
    })
    filteredCompareData = compareYearData.filter((d) => {
      if (
        filteredGeoJSON.features.findIndex(
          (e) => e.properties.AC_NAME === d.AC_NAME
        ) > -1
      ) {
        return d
      }
    })
  }
  presentYearDataTable = getCurrYearDataTable(
    filteredPresData,
    SVGData,
    electionType,
    groupType,
    partyAlliance,
    selectedStateUT,
    selectedConstituency
  )
  if (compareYearData.length != 0) {
    compareYearDataTable = getCompareYearDataTable(
      filteredCompareData,
      SVGData,
      electionType,
      groupType,
      partyAlliance,
      selectedStateUT,
      selectedConstituency,
      mapDataConstituencies
    )
  }
  if (
    filteredCompareData.length === 0 ||
    (compareYearDataTable && compareYearDataTable.length === 0)
  ) {
    if (groupType === "party") {
      presentYearDataTable.map((d, index) => {
        tableData.push({
          party: d.party,
          seats: d.seats,
          seatsDiff: "--",
          votes: d.votes,
          votesPercent: d.votesPercent,
          votesPercentDiff: "--"
        })
      })
    } else {
      presentYearDataTable.map((d, index) => {
        tableData.push({
          alliance: d.alliance,
          seats: d.seats,
          seatsDiff: "--",
          votes: d.votes,
          votesPercent: d.votesPercent,
          votesPercentDiff: "--"
        })
      })
    }
    if(electionType !== compareElectionType) {
      tableData = tableData.map((d) => {
        return {...d, seatsDiff: "--"}
      })
    }
    return tableData
  } else {
    presentYearDataTable &&
      compareYearDataTable &&
      presentYearDataTable.map((d, index) => {
        if (groupType === "party") {
          tableData.push({
            party: d.party,
            seats: d.seats,
            seatsDiff:
              parseInt(d.seats) - parseInt(compareYearDataTable[index].seats),
            votes: d.votes,
            votesPercent: d.votesPercent,
            votesPercentDiff: (
              parseFloat(d.votesPercent) -
              parseFloat(compareYearDataTable[index].votesPercent)
            ).toFixed(2)
          })
        } else {
          tableData.push({
            alliance: d.alliance,
            seats: d.seats,
            seatsDiff:
              parseInt(d.seats) - parseInt(compareYearDataTable[index].seats),
            votes: d.votes,
            votesPercent: d.votesPercent,
            votesPercentDiff: (
              parseFloat(d.votesPercent) -
              parseFloat(compareYearDataTable[index].votesPercent)
            ).toFixed(2)
          })
        }
      })
    if(electionType !== compareElectionType) {
      tableData.map((d) => d.seatsDiff = "--")
    }
    return tableData
  }
}

/**
 * Function for getting total seats-won and votes-won-percentage by each group in a current year
 * @param {Array<Object>} data Data of a selected State/UT or Constituency
 * @param {Object<Object>} SVGData List of parties and the number of seats won
 * @param {string} electionType general or assembly
 * @param {string} groupType party or alliance
 * @param {Array<Object>} partyAlliance List of Parties and their respective alliance
 * @param {string} selectedStateUT Selected State/UT
 * @param {string} selectedConstituency Selected Constituency
 * @returns Array<Object> Total seats-won and votes-won-percentage by each group in a current year
 */
const getCurrYearDataTable = (
  data,
  SVGData,
  electionType,
  groupType,
  partyAlliance,
  selectedStateUT,
  selectedConstituency
) => {
  let totalVotes = 0
  let tableData = []
  if (
    selectedConstituency === CONSTITUENCIES_DEFAULT_SELECT ||
    selectedStateUT === STATE_UT_DEFAULT_SELECT
  ) {
    if (groupType === "party") {
      for (const property in SVGData) {
        tableData.push({
          party: `${property}`,
          seats: `${SVGData[property].seats}`,
          votes: 0,
          votesPercent: 0
        })
      }
      if (
        tableData.indexOf(tableData.find(({ party }) => party == "OTHERS")) < 0
      ) {
        tableData.push({
          party: "OTHERS",
          seats: 0,
          votes: 0,
          votesPercent: 0
        })
      }
    } else {
      for (const property in SVGData) {
        tableData.push({
          alliance: `${property}`,
          seats: `${SVGData[property].seats}`,
          votes: 0,
          votesPercent: 0
        })
      }
      if (
        tableData.indexOf(
          tableData.find(({ alliance }) => alliance == "OTHERS")
        ) < 0
      ) {
        tableData.push({
          alliance: "OTHERS",
          seats: 0,
          votes: 0,
          votesPercent: 0
        })
      }
    }
    if (groupType === "party") {
      data.map((d) => {
        let temp = tableData.indexOf(
          tableData.find(({ party }) => party == d.PARTY)
        )
        if (temp > -1 && !Number.isNaN(parseInt(d.VOTES))) {
          tableData[temp].votes += parseInt(d.VOTES)
        } else if (temp < 0 && !Number.isNaN(parseInt(d.VOTES))) {
          parseInt(d.VOTES) &&
            tableData[tableData.length - 1] &&
            (tableData[tableData.length - 1].votes += parseInt(d.VOTES))
        }
      })
    } else {
      data.map((d) => {
        let temp =
          partyAlliance.find((e) => e.PARTY == d.PARTY) &&
          tableData.indexOf(
            tableData.find(
              ({ alliance }) =>
                alliance ==
                partyAlliance.find((e) => e.PARTY == d.PARTY).ALLIANCE
            )
          )
        if (temp > -1 && !Number.isNaN(parseInt(d.VOTES))) {
          tableData[temp].votes += parseInt(d.VOTES)
        } else if (temp < 0 && !Number.isNaN(parseInt(d.VOTES))) {
          parseInt(d.VOTES) &&
            tableData[tableData.length - 1] &&
            (tableData[tableData.length - 1].votes += parseInt(d.VOTES))
        }
      })
    }
  } else {
    let constituencyStats = []
    if (electionType === "general") {
      if (data.find((c) => c.PC_NAME == selectedConstituency)) {
        constituencyStats = data.find(
          (c) => c.PC_NAME == selectedConstituency
        ).stats
      }
    } else {
      if (data.find((c) => c.AC_NAME == selectedConstituency)) {
        constituencyStats = data.find(
          (c) => c.AC_NAME == selectedConstituency
        ).stats
      }
    }
    if (groupType === "party") {
      constituencyStats.map((d, index) =>
        tableData.push({
          party: d.party,
          seats: index == 0 ? 1 : 0,
          votes: d.votesReceived,
          votesPercent: 0
        })
      )
    } else {
      let alliances = new Set()
      constituencyStats.map((d) => {
        partyAlliance.find((e) => e.PARTY == d.party)
          ? alliances.add(
              partyAlliance.find((e) => e.PARTY === d.party).ALLIANCE
            )
          : alliances.add("OTHERS")
      })
      alliances = [...alliances]
      alliances.map((d, index) => {
        tableData.push({
          alliance: d,
          seats: index == 0 ? 1 : 0,
          votes: 0,
          votesPercent: 0
        })
      })
      constituencyStats.map((d) => {
        let tempAlliance = partyAlliance.find((e) => e.PARTY == d.party)
          ? partyAlliance.find((e) => e.PARTY == d.party).ALLIANCE
          : "OTHERS"
        let tempIndex = tableData.indexOf(
          tableData.find(({ alliance }) => alliance == tempAlliance)
        )
        if (!Number.isNaN(parseInt(d.votesReceived))) {
          tableData[tempIndex].votes += d.votesReceived
        }
      })
    }
  }
  tableData.map((d) => (totalVotes += d.votes))
  tableData.map(
    (d) => (d.votesPercent = ((d.votes / totalVotes) * 100).toFixed(2))
  )
  return tableData
}

/**
 * To get list of parties and their respective seats-won and votes-won-percentage in selected election to compare
 * @param {Array<Object>} compareYearData Selected Elections to compare  Data
 * @param {Object<Object>} SVGData List of parties and the number of seats won
 * @param {string} electionType general or assembly
 * @param {string} groupType party or alliance
 * @param {Array<Object>} partyAlliance List of Parties and their respective alliance
 * @param {string} selectedStateUT Selected State/UT
 * @param {string} selectedConstituency Selected Constituency
 * @param {Array<Object>} mapDataConstituencies Current year elections data of a constituency for List of Parties
 * @returns {Array<Object>} - List of parties and their respective seats-won and votes-won-percentage in election to be compared
 */
const getCompareYearDataTable = (
  compareYearData,
  SVGData,
  electionType,
  groupType,
  partyAlliance,
  selectedStateUT,
  selectedConstituency,
  mapDataConstituencies
) => {
  let compareMapData = {}
  let compareSelectedStateUTData = []
  let compareStats = []

  if (compareYearData) {
    compareSelectedStateUTData = getDataStateUT(compareYearData, selectedStateUT)
    const compareSelectedConstituencyData =
      compareSelectedStateUTData &&
      getDataConstituency(
        compareSelectedStateUTData,
        selectedConstituency,
        electionType
      )
    compareMapData = getMapData(compareYearData, selectedStateUT, electionType)
    const compareConstituenciesResults =
      compareMapData &&
      getConstituenciesResults(
        compareMapData,
        selectedConstituency,
        electionType,
        groupType,
        partyAlliance
      )
    if (electionType === "general") {
      if (
        selectedStateUT === STATE_UT_DEFAULT_SELECT ||
        selectedConstituency === CONSTITUENCIES_DEFAULT_SELECT
      ) {
        compareStats =
          compareConstituenciesResults &&
          SVGData &&
          compareSeatsVotesCount(
            compareSelectedStateUTData,
            compareConstituenciesResults,
            SVGData,
            selectedStateUT,
            selectedConstituency,
            mapDataConstituencies,
            electionType,
            groupType,
            partyAlliance
          )
      } else {
        compareStats =
          compareConstituenciesResults &&
          SVGData &&
          compareSeatsVotesCount(
            compareMapData.constituencies,
            compareConstituenciesResults,
            SVGData,
            selectedStateUT,
            selectedConstituency,
            mapDataConstituencies,
            electionType,
            groupType,
            partyAlliance
          )
      }
    } else {
      if (selectedStateUT === STATE_UT_DEFAULT_SELECT) {
        compareStats = []
      } else {
        compareStats =
          compareConstituenciesResults &&
          SVGData &&
          compareSeatsVotesCount(
            selectedConstituency === CONSTITUENCIES_DEFAULT_SELECT
              ? compareSelectedStateUTData
              : compareSelectedConstituencyData,
            compareConstituenciesResults,
            SVGData,
            selectedStateUT,
            selectedConstituency,
            mapDataConstituencies,
            electionType,
            groupType,
            partyAlliance
          )          
      }
    }
    return compareStats
  }
}

/**
 * Calculates for selected election to be compared's data table and return list of parties and their respective seats-won and votes-won-percentage
 * @param {Array<Object>} data Data for a Selected State/UT or Constituency
 * @param {Array<Object>} constituenciesResults List of winning parties and candidates in each constituency
 * @param {Object<Object>} SVGData List of parties and the number of seats won
 * @param {string} selectedStateUT Selected State/UT
 * @param {string} selectedConstituency Selected Constituency
 * @param {Array<Object>} mapDataConstituencies Current year elections data of a constituency for List of Parties
 * @param {string} electionType general or assembly
 * @param {string} groupType party or alliance
 * @param {Array<Object>} partyAlliance List of Parties and their respective alliance
 * @returns {Array<Object>} - List of parties and their respective seats-won and votes-won-percentage in selected election to be comapared
 */
const compareSeatsVotesCount = (
  data,
  constituenciesResults,
  SVGData,
  selectedStateUT,
  selectedConstituency,
  mapDataConstituencies,
  electionType,
  groupType,
  partyAlliance
) => {
  let stats = []
  let totalVotes = 0

  if (data.length === 0) {
    return []
  }
  if (
    selectedStateUT === STATE_UT_DEFAULT_SELECT ||
    selectedConstituency === CONSTITUENCIES_DEFAULT_SELECT
  ) {
    const groups = Object.keys(SVGData)
    groups.indexOf("OTHERS") === -1 ? groups.push("OTHERS") : ""
    if (groupType === "party") {
      groups.map((d) =>
        stats.push({
          party: d,
          seats: 0,
          votes: 0,
          votesPercent: 0
        })
      )
      data.map((d) => {
        const temp =
          stats.findIndex(
            (e) => e == stats.find(({ party }) => party === d.PARTY)
          ) != -1
            ? stats.findIndex(
                (e) => e == stats.find(({ party }) => party === d.PARTY)
              )
            : stats.length - 1
        if (!Number.isNaN(parseInt(d.VOTES))) {
          stats[temp].votes += parseInt(d.VOTES)
        }
      })
      constituenciesResults.map((d) => {
        const temp =
          stats.findIndex(
            (e) => e == stats.find(({ party }) => party === d.party)
          ) != -1
            ? stats.findIndex(
                (e) => e == stats.find(({ party }) => party === d.party)
              )
            : stats.length - 1
        stats[temp].seats += 1
      })
    } else {
      groups.map((d) =>
        stats.push({
          alliance: d,
          seats: 0,
          votes: 0,
          votesPercent: 0
        })
      )
      data.map((d) => {
        const allianceTemp = partyAlliance.find((e) => e.PARTY == d.PARTY)
          ? partyAlliance.find((e) => e.PARTY === d.PARTY).ALLIANCE
          : "OTHERS"
        const temp =
          stats.findIndex(
            (e) =>
              e == stats.find(({ alliance }) => alliance === allianceTemp)
          ) != -1
            ? stats.findIndex(
                (e) =>
                  e == stats.find(({ alliance }) => alliance === allianceTemp)
              )
            : stats.length - 1
        if (!Number.isNaN(parseInt(d.VOTES))) {
          stats[temp].votes += parseInt(d.VOTES)
        }
      })
      constituenciesResults.map((d) => {
        const temp =
          stats.findIndex(
            (e) => e == stats.find(({ alliance }) => alliance === d.alliance)
          ) != -1
            ? stats.findIndex(
                (e) =>
                  e == stats.find(({ alliance }) => alliance === d.alliance)
              )
            : stats.length - 1
        stats[temp].seats += 1
      })
    }
    stats &&
      stats.map((d) => {
        if (!Number.isNaN(parseInt(d.votes))) {
          totalVotes += parseInt(d.votes)
        }
      })
    stats &&
      stats.map(
        (d) => (d.votesPercent = ((d.votes / totalVotes) * 100).toFixed(2))
      )
    return stats
  } else {
    let groups = []
    let compareStats = []
    if (mapDataConstituencies.length != 0) {
      if(electionType === "general") {
        groups = mapDataConstituencies
          .find((e) => e.PC_NAME === selectedConstituency)
          .stats.map((d) => d.party)
      } else {groups = mapDataConstituencies
        .find((e) => e.AC_NAME === selectedConstituency)
        .stats.map((d) => d.party)      
      }      
      groups.indexOf("OTHERS") === -1 ? groups.push("OTHERS") : ""
      if (groupType === "party") {
        groups.map((d) =>
          stats.push({
            party: d,
            seats: 0,
            votes: 0,
            votesPercent: 0
          })
        )
          if(electionType === "general") {
            compareStats = data.find((e) => e.PC_NAME === selectedConstituency)
              ? data.find((e) => e.PC_NAME === selectedConstituency).stats
              : []
            compareStats.map((d) => {
              const temp =
                stats.findIndex(
                  (e) => e == stats.find(({ party }) => party === d.party)
                ) != -1
                  ? stats.findIndex(
                      (e) => e == stats.find(({ party }) => party === d.party)
                    )
                  : stats.length - 1
              if (temp === 1) {
                stats[temp].seats += 1
                stats[temp].votes += d.votesReceived
              } else {
                const temp =
                  stats.findIndex(
                    (e) => e == stats.find(({ party }) => party === d.party)
                  ) != -1
                    ? stats.findIndex(
                        (e) => e == stats.find(({ party }) => party === d.party)
                      )
                    : stats.length - 1
                stats[temp].votes += d.votesReceived
              }
            })
          } else {
            compareStats = data.filter((e) => e.AC_NAME === selectedConstituency)
            compareStats.map((d) => {
              const temp =
                stats.findIndex(
                  (e) => e == stats.find(({ party }) => party === d.PARTY)
                ) != -1
                  ? stats.findIndex(
                      (e) => e == stats.find(({ party }) => party === d.PARTY)
                    )
                  : stats.length - 1
              if (temp === 1) {
                stats[temp].seats += 1
                stats[temp].votes += parseInt(d.VOTES)
              } else {
                const temp =
                  stats.findIndex(
                    (e) => e == stats.find(({ party }) => party === d.PARTY)
                  ) != -1
                    ? stats.findIndex(
                        (e) => e == stats.find(({ party }) => party === d.PARTY)
                      )
                    : stats.length - 1
                stats[temp].votes += parseInt(d.VOTES)
              }
            })
          }
      } else {
        if(electionType === "general") {
          let tempGroups = new Set()
          groups.map((d) => {
            const temp = partyAlliance.find((e) => e.PARTY == d)
              ? partyAlliance.find((e) => e.PARTY === d).ALLIANCE
              : "OTHERS"
            tempGroups.add(temp)
          })
          groups = [...tempGroups]
          groups.map((d) =>
            stats.push({
              alliance: d,
              seats: 0,
              votes: 0,
              votesPercent: 0
            })
          )
          compareStats = data.find((e) => e.PC_NAME === selectedConstituency).stats
          compareStats.map((d) => {
            const allianceTemp = partyAlliance.find((e) => e.PARTY == d.party)
              ? partyAlliance.find((e) => e.PARTY === d.party).ALLIANCE
              : "OTHERS"
            const temp =
              stats.findIndex(
                (e) =>
                  e == stats.find(({ alliance }) => alliance === allianceTemp)
              ) != -1
                ? stats.findIndex(
                    (e) =>
                      e ==
                      stats.find(({ alliance }) => alliance === allianceTemp)
                  )
                : stats.length - 1
            if (temp === 1) {
              stats[temp].seats += 1
              stats[temp].votes += d.votesReceived
            } else {
              const temp =
                stats.findIndex(
                  (e) =>
                    e == stats.find(({ alliance }) => alliance === allianceTemp)
                ) != -1
                  ? stats.findIndex(
                      (e) =>
                        e ==
                        stats.find(({ alliance }) => alliance === allianceTemp)
                    )
                  : stats.length - 1
              stats[temp].votes += d.votesReceived
            }
          })
        } else {
          let tempGroups = new Set()
          groups.map((d) => {
            const temp = partyAlliance.find((e) => e.PARTY == d)
              ? partyAlliance.find((e) => e.PARTY === d).ALLIANCE
              : "OTHERS"
            tempGroups.add(temp)
          })
          groups = [...tempGroups]
          groups.map((d) =>
            stats.push({
              alliance: d,
              seats: 0,
              votes: 0,
              votesPercent: 0
            })
          )
          compareStats = data.filter((e) => e.AC_NAME === selectedConstituency)
          compareStats.map((d) => {
            const allianceTemp = partyAlliance.find((e) => e.PARTY == d.PARTY)
              ? partyAlliance.find((e) => e.PARTY === d.PARTY).ALLIANCE
              : "OTHERS"
            const temp =
              stats.findIndex(
                (e) =>
                  e == stats.find(({ alliance }) => alliance === allianceTemp)
              ) != -1
                ? stats.findIndex(
                    (e) =>
                      e ==
                      stats.find(({ alliance }) => alliance === allianceTemp)
                  )
                : stats.length - 1
            if (temp === 1) {
              stats[temp].seats += 1
              stats[temp].votes += parseInt(d.VOTES)
            } else {
              const temp =
                stats.findIndex(
                  (e) =>
                    e == stats.find(({ alliance }) => alliance === allianceTemp)
                ) != -1
                  ? stats.findIndex(
                      (e) =>
                        e ==
                        stats.find(({ alliance }) => alliance === allianceTemp)
                    )
                  : stats.length - 1
              stats[temp].votes += parseInt(d.VOTES)
            }
          })
        }
      }
    }
    stats && stats.map((d) => (totalVotes += d.votes))
    stats &&
      stats.map(
        (d) => (d.votesPercent = ((d.votes / totalVotes) * 100).toFixed(2))
      )
    return stats
  }
}
