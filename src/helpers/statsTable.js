import {
  ALL_STATE_UT,
  ALL_CONSTITUENCIES,
  FIRST_SELECT_STATEUT,
  NO_CONSTITUENCIES
} from "../constants"
import { getDataStateUT } from "./utils"
import { getMapData, getConstituenciesResults } from "./mapData"

/**
 * Calculate Data for selected region stats table
 * @param {Array<Object>} presentYearData Selected election data
 * @param {Array<Object>} compareYearData Selected comparable election data to be compared with
 * @param {object<Object>} SVGData Data for region stats SVG
 * @param {String} electionViewType general or assembly
 * @param {Object} selectedElection Selected election:{type: "assembly"/"general", year: "year"}
 * @param {Object} compareElection Selected election to be compared with :{type: "assembly"/"general", year: "year"}
 * @param {String} groupType party or alliance
 * @param {Array<Object>} partyAlliance party and their respective alliance
 * @param {String} selectedStateUT Selected State or UT
 * @param {Array<String>} stateUTOptions List of state/UT options to be selected
 * @param {String} selectedConstituency Selected Constituency
 * @param {Object} mapDataConstituencies Top four contestant stats of every constituencies of every state
 * @param {GeoJSON} filteredGeoJSON Filtered GeoJson
 * @param {Object} colorPartyAlliance List Parties and Aliiances and their respective color
 * @returns {Array<Objects>} - Data of Party and their seats won, votes received, seats difference with respect to selected election to compare, percentage of votes received, difference of percentage of votes received with respect to last election
 */
export const getRegionStatsTable = (
  presentYearData,
  compareYearData,
  SVGData,
  electionViewType,
  selectedElection,
  compareElection,
  groupType,
  partyAlliance,
  selectedStateUT,
  stateUTOptions,
  selectedConstituency,
  mapDataConstituencies,
  filteredGeoJSON,
  colorPartyAlliance
) => {
  const compareElectionType = compareElection.type
  let tableData = [],
    presentYearDataTable = [],
    compareYearDataTable = [],
    filteredPresData = [],
    filteredCompareData = []

  if (electionViewType === "general") {
    filteredPresData = presentYearData.filter((d) => {
      if (
        filteredGeoJSON.features.findIndex(
          (e) => e.properties.PC_NAME === d.PC_NAME
        ) > -1
      )
        return d
    })
    selectedStateUT === ALL_STATE_UT && compareElectionType !== electionViewType
      ? (filteredCompareData = [])
      : (filteredCompareData = compareYearData.filter((d) => {
          if (
            filteredGeoJSON.features.findIndex(
              (e) => e.properties.PC_NAME === d.PC_NAME
            ) > -1
          )
            return d
        }))
  } else {
    filteredPresData =
      presentYearData &&
      presentYearData.length !== 0 &&
      presentYearData.filter((d) => {
        if (
          filteredGeoJSON.features.findIndex(
            (e) => e.properties.AC_NAME === d.AC_NAME
          ) > -1
        )
          return d
      })
    filteredCompareData = compareYearData.filter((d) => {
      if (
        filteredGeoJSON.features.findIndex(
          (e) => e.properties.AC_NAME === d.AC_NAME
        ) > -1
      )
        return d
    })
  }

  presentYearDataTable = getCurrYearDataTable(
    filteredPresData,
    mapDataConstituencies,
    SVGData,
    groupType,
    partyAlliance,
    selectedStateUT,
    selectedConstituency
  )
  compareYearDataTable =
    compareYearData.length != 0 &&
    getCompareYearDataTable(
      filteredCompareData,
      SVGData,
      electionViewType,
      selectedElection,
      groupType,
      partyAlliance,
      selectedStateUT,
      stateUTOptions,
      selectedConstituency,
      mapDataConstituencies,
      colorPartyAlliance,
      filteredGeoJSON
    )
  if (
    filteredCompareData.length === 0 ||
    (compareYearDataTable && compareYearDataTable.length === 0)
  ) {
    groupType === "party"
      ? presentYearDataTable.map((d) => {
          tableData.push({
            party: d.party,
            seats: d.seats,
            seatsDiff: "--",
            votes: d.votes,
            votesPercent: d.votesPercent,
            votesPercentDiff: "--"
          })
        })
      : presentYearDataTable.map((d) => {
          tableData.push({
            alliance: d.alliance,
            seats: d.seats,
            seatsDiff: "--",
            votes: d.votes,
            votesPercent: d.votesPercent,
            votesPercentDiff: "--"
          })
        })
  } else {
    presentYearDataTable &&
      compareYearDataTable &&
      presentYearDataTable.map((d, index) => {
        groupType === "party"
          ? tableData.push({
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
          : tableData.push({
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
      })
  }
  return tableData
}

/**
 * Function for getting total seats-won and votes-won-percentage by each group in a current year
 * @param {Array<Object>} data Data of a selected State/UT or Constituency
 * @param {Object} mapDataConstituencies Top four contestant stats of every constituencies of every state
 * @param {Object<Object>} SVGData List of parties and the number of seats won
 * @param {string} groupType party or alliance
 * @param {Array<Object>} partyAlliance List of Parties and their respective alliance
 * @param {string} selectedStateUT Selected State/UT
 * @param {string} selectedConstituency Selected Constituency
 * @returns Array<Object> Total seats-won and votes-won-percentage by each group in a current year
 */
const getCurrYearDataTable = (
  data,
  mapDataConstituencies,
  SVGData,
  groupType,
  partyAlliance,
  selectedStateUT,
  selectedConstituency
) => {
  let totalVotes = 0,
    tableData = []
  if (
    selectedConstituency === ALL_CONSTITUENCIES ||
    selectedConstituency === NO_CONSTITUENCIES ||
    selectedStateUT === ALL_STATE_UT
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
      data
        ? data.map((d) => {
            let temp = tableData.indexOf(
              tableData.find(({ party }) => party == d.PARTY)
            )
            if (temp > -1 && !Number.isNaN(parseInt(d.VOTES))) {
              tableData[temp].votes += parseInt(d.VOTES)
            }
            if (temp < 0 && !Number.isNaN(parseInt(d.VOTES))) {
              parseInt(d.VOTES) &&
                tableData[tableData.length - 1] &&
                (tableData[tableData.length - 1].votes += parseInt(d.VOTES))
            }
          })
        : (tableData[0].votes = 0)
    } else {
      data
        ? data.map((d) => {
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
            }
            if (temp < 0 && !Number.isNaN(parseInt(d.VOTES))) {
              parseInt(d.VOTES) &&
                tableData[tableData.length - 1] &&
                (tableData[tableData.length - 1].votes += parseInt(d.VOTES))
            }
          })
        : (tableData[0].votes = 0)
    }
  } else {
    if (groupType === "party") {
      mapDataConstituencies &&
        mapDataConstituencies.map((d, index) =>
          tableData.push({
            party: d.party,
            seats: index == 0 ? 1 : 0,
            votes: d.votesReceived,
            votesPercent: 0
          })
        )
    } else {
      let alliances = new Set()
      mapDataConstituencies &&
        mapDataConstituencies.map((d) => {
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
      mapDataConstituencies &&
        mapDataConstituencies.map((d) => {
          let tempAlliance = partyAlliance.find((e) => e.PARTY == d.party)
            ? partyAlliance.find((e) => e.PARTY == d.party).ALLIANCE
            : "OTHERS"
          let tempIndex = tableData.indexOf(
            tableData.find(({ alliance }) => alliance == tempAlliance)
          )
          if (!Number.isNaN(parseInt(d.votesReceived)))
            tableData[tempIndex].votes += d.votesReceived
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
 * @param {string} electionViewType general or assembly
 * @param {Object} selectedElection Selected election:{type: "assembly"/"general", year: "year"}
 * @param {string} groupType party or alliance
 * @param {Array<Object>} partyAlliance List of Parties and their respective alliance
 * @param {string} selectedStateUT Selected State/UT
 * @param {Array<String>} stateUTOptions List of state/UT options to be selected
 * @param {string} selectedConstituency Selected Constituency
 * @param {Array<Object>} mapDataConstituencies Current year elections data of a constituency for List of Parties
 * @param {Object} colorPartyAlliance - List Parties and Aliiances and their respective color
 * @param {GeoJSON} filteredGeoJSON Filtered GeoJson
 * @returns {Array<Object>} - List of parties and their respective seats-won and votes-won-percentage in election to be compared
 */
const getCompareYearDataTable = (
  compareYearData,
  SVGData,
  electionViewType,
  selectedElection,
  groupType,
  partyAlliance,
  selectedStateUT,
  stateUTOptions,
  selectedConstituency,
  mapDataConstituencies,
  colorPartyAlliance,
  filteredGeoJSON
) => {
  let compareMapData = {},
    compareSelectedStateUTData = [],
    compareStats = []
  if (compareYearData) {
    compareSelectedStateUTData = getDataStateUT(
      compareYearData,
      selectedStateUT
    )
    compareMapData = getMapData(
      compareYearData,
      stateUTOptions,
      electionViewType,
      partyAlliance,
      colorPartyAlliance,
      selectedElection,
      selectedStateUT,
      filteredGeoJSON
    )
    const compareConstituenciesResults =
      compareMapData &&
      getConstituenciesResults(
        compareYearData,
        electionViewType,
        selectedElection,
        stateUTOptions,
        selectedStateUT,
        selectedConstituency,
        groupType,
        partyAlliance,
        colorPartyAlliance,
        filteredGeoJSON
      )
    if (electionViewType === "general") {
      if (
        selectedStateUT === ALL_STATE_UT ||
        selectedConstituency === ALL_CONSTITUENCIES
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
            groupType,
            partyAlliance
          )
      } else {
        compareStats =
          compareConstituenciesResults &&
          SVGData &&
          compareSeatsVotesCount(
            compareMapData[selectedStateUT][selectedConstituency],
            compareConstituenciesResults,
            SVGData,
            selectedStateUT,
            selectedConstituency,
            mapDataConstituencies,
            groupType,
            partyAlliance
          )
      }
    } else {
      selectedStateUT === ALL_STATE_UT
        ? (compareStats = [])
        : (compareStats =
            compareConstituenciesResults &&
            SVGData &&
            compareSeatsVotesCount(
              selectedConstituency === ALL_CONSTITUENCIES
                ? compareSelectedStateUTData
                : compareMapData[selectedStateUT][selectedConstituency],
              compareConstituenciesResults,
              SVGData,
              selectedStateUT,
              selectedConstituency,
              mapDataConstituencies,
              groupType,
              partyAlliance
            ))
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
  groupType,
  partyAlliance
) => {
  let stats = [],
    totalVotes = 0
  if (data === undefined || data.length === 0) return []
  if (
    selectedStateUT === ALL_STATE_UT ||
    selectedConstituency === ALL_CONSTITUENCIES ||
    selectedConstituency === FIRST_SELECT_STATEUT
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
        if (!Number.isNaN(parseInt(d.VOTES)))
          stats[temp].votes += parseInt(d.VOTES)
      })
      for (const stateUT in constituenciesResults) {
        for (const row in constituenciesResults[stateUT]) {
          const tempIndex = stats.findIndex(
            ({ party }) => party === constituenciesResults[stateUT][row].party
          )
          const partyIndex = tempIndex !== -1 ? tempIndex : stats.length - 1
          stats[partyIndex].seats += 1
        }
      }
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
            (e) => e == stats.find(({ alliance }) => alliance === allianceTemp)
          ) != -1
            ? stats.findIndex(
                (e) =>
                  e == stats.find(({ alliance }) => alliance === allianceTemp)
              )
            : stats.length - 1
        if (!Number.isNaN(parseInt(d.VOTES)))
          stats[temp].votes += parseInt(d.VOTES)
      })
      for (const stateUT in constituenciesResults) {
        for (const row in constituenciesResults[stateUT]) {
          const tempIndex = stats.findIndex(
            ({ alliance }) =>
              alliance === constituenciesResults[stateUT][row].alliance
          )
          const allianceIndex = tempIndex !== -1 ? tempIndex : stats.length - 1
          stats[allianceIndex].seats += 1
        }
      }
    }
    stats &&
      stats.map((d) => {
        if (!Number.isNaN(parseInt(d.votes))) totalVotes += parseInt(d.votes)
      })
    stats &&
      stats.map(
        (d) => (d.votesPercent = ((d.votes / totalVotes) * 100).toFixed(2))
      )
    return stats
  } else {
    if (selectedConstituency) {
      let groups = [],
        compareStats = []
      if (mapDataConstituencies.length != 0) {
        if (groupType === "party") {
          groups = mapDataConstituencies.map((d) => d.party)
          groups.indexOf("OTHERS") === -1 ? groups.push("OTHERS") : ""
          groups.map((d) =>
            stats.push({
              party: d,
              seats: 0,
              votes: 0,
              votesPercent: 0
            })
          )
          data.map((d) => {
            const tempIndex = stats.findIndex((e) => e.party === d.party)
            tempIndex !== -1
              ? (stats[tempIndex].votes += d.votesReceived)
              : (stats[stats.length - 1].votes += d.votesReceived)
          })
          const sortedData = data.sort((a, b) => a.votes - b.votes)
          const winningParty = sortedData[0].party
          const tempIndex = stats.findIndex((e) => e.party === winningParty)
          tempIndex !== -1
            ? (stats[tempIndex].seats = 1)
            : (stats[stats.length - 1].seats = 1)
        } else {
          let tempGroups = new Set()
          mapDataConstituencies.map((d) => {
            const tempPartyAlliance = partyAlliance.find(
              (p) => p.PARTY === d.party
            )
            tempPartyAlliance
              ? tempGroups.add(tempPartyAlliance.ALLIANCE)
              : tempGroups.add("OTHERS")
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
          data.map((d) => {
            const tempPartyAlliance = partyAlliance.find(
              (p) => p.PARTY === d.party
            )
            const tempAlliance = tempPartyAlliance
              ? tempPartyAlliance.ALLIANCE
              : "OTHERS"
            const tempIndex = stats.findIndex(
              (e) => e.alliance === tempAlliance
            )
            tempIndex !== -1
              ? (stats[tempIndex].votes += d.votesReceived)
              : (stats[stats.length - 1].votes += d.votesReceived)
          })
          const sortedData = data.sort((a, b) => a.votes - b.votes)
          const winningParty = sortedData[0].party
          const tempPartyAlliance = partyAlliance.find(
            (p) => p.PARTY === winningParty
          )
          const tempAlliance = tempPartyAlliance
            ? tempPartyAlliance.ALLIANCE
            : "OTHERS"
          const tempIndex = stats.findIndex((e) => e.alliance === tempAlliance)
          tempIndex !== -1
            ? (stats[tempIndex].seats = 1)
            : (stats[stats.length - 1].seats = 1)
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
}
