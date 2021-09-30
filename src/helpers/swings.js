import { ALL_STATE_UT } from "../constants"
import { getConstituencies, getDataStateUT } from "./utils"
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
      newAlliance: false
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
  partyAlliance && partyAlliance.map((d) => alliances.add(d.ALLIANCE))
  alliances = [...alliances]
  const params = addParams(alliances)
  return params
}

/**
 * Calcuate and Retrun Swings
 * @param {Array<Object>} selectedYearData Selected year data
 * @param {String} selectedStateUT Selected State/UT
 * @param {Array} constituencyOptions Array of Constituencies of a State/UT
 * @param {Array<Object>} partiesSwing Array of Objects, Swing Parties
 * @returns {Array<Object>} Array of objects Swings
 */
export const calculateSwings = (
  selectedYearData,
  selectedStateUT,
  filteredGeoJSON,
  partiesSwing,
  electionViewType
) => {
  if (
    filteredGeoJSON.length !== 0 &&
    partiesSwing.length !== 0 &&
    selectedStateUT !== ALL_STATE_UT &&
    selectedYearData.length !== 0
  ) {
    let constituencies, selectedStateUTData, constituencyOptions
    selectedStateUTData = getDataStateUT(selectedYearData, selectedStateUT)
    constituencyOptions = getConstituencies(
      selectedStateUTData,
      selectedStateUT,
      electionViewType,
      filteredGeoJSON
    )
    constituencyOptions.length > 1
      ? (constituencies = constituencyOptions.slice(1))
      : (constituencies = constituencyOptions)
    const totalVotesPolledData = calculateConstituencyVotesPolled(
      selectedStateUTData,
      constituencies,
      electionViewType
    )
    const swingState = calculateVoteShare(
      totalVotesPolledData,
      constituencies,
      partiesSwing,
      electionViewType
    )
    const allStates = selectedYearData.filter(
      (state) => state.ST_NAME !== selectedStateUT
    )
    const swings = [...swingState, ...allStates]
    return swings
  }
}

/**
 * Calculate votes polled for the selected State/UT
 * @param {Array<Object>} selectedStateUTData Selected State/UT Data
 * @param {Array} constituencies List of Constituencies and their code in a State/UT
 * @param {String} electionViewType assembly/general
 * @returns {Array<Object>} Array of objects with calculated Votes Polled
 */
const calculateConstituencyVotesPolled = (
  selectedStateUTData,
  constituencies,
  electionViewType
) => {
  let totalVotes = []
  if (electionViewType === "general") {
    totalVotes = constituencies.map((constituency) => {
      const assemblyFilter = selectedStateUTData.filter(
        (row) => row.PC_NO == constituency.code
      )
      const total = assemblyFilter
        .map((row) => row.VOTES)
        .reduce((prev, next) => Number(prev) + Number(next), 0)
      const addedVotesArray = assemblyFilter.map((row) => {
        return { ...row, TOTAL_VOTES_POLLED: total }
      })
      return addedVotesArray
    })
  } else {
    totalVotes = constituencies.map((constituency) => {
      const assemblyFilter = selectedStateUTData.filter(
        (row) => row.AC_NO == constituency.code
      )
      const total = assemblyFilter
        .map((row) => row.VOTES)
        .reduce((prev, next) => Number(prev) + Number(next), 0)
      const addedVotesArray = assemblyFilter.map((row) => {
        return { ...row, TOTAL_VOTES_POLLED: total }
      })
      return addedVotesArray
    })
  }
  const totalVotesPolled = totalVotes.filter((row) => row.length !== 0)
  return totalVotesPolled.flat()
}

/**
 * Calculate total Vote Share
 * @param {Array<Object>} totalVotesPolledData Array of objects with total vote share calculated
 * @param {Array} constituencies Selected State/UT
 * @param {Array<Object>} partiesSwing Array of Objects, Swing Parties
 * @param {String} electionViewType assembly/general
 * @returns {Array<Object>} Array of objects with calculated Votes Share
 */
const calculateVoteShare = (
  totalVotesPolledData,
  constituencies,
  partiesSwing,
  electionViewType
) => {
  let updateVotes = []
  if (electionViewType === "general") {
    updateVotes = constituencies.map((constituency) => {
      const assemblyFilter = totalVotesPolledData.filter(
        (row) => row.PC_NO == constituency.code
      )
      const newVoteShare = assemblyFilter.map((row) => {
        const swingParty = partiesSwing.find((d) => d.PARTY === row.PARTY)
        let swingVotes = 0
        if (swingParty)
          swingVotes = Math.round(
            (Number(row.TOTAL_VOTES_POLLED) * swingParty.swing) / 100
          )
        return {
          ...row,
          VOTES:
            swingVotes !== 0
              ? Number(row.VOTES) + swingVotes
              : Number(row.VOTES)
        }
      })
      return newVoteShare
    })
  } else {
    updateVotes = constituencies.map((constituency) => {
      const assemblyFilter = totalVotesPolledData.filter(
        (row) => row.AC_NO == constituency.code
      )
      const newVoteShare = assemblyFilter.map((row) => {
        const swingParty = partiesSwing.find((d) => d.PARTY === row.PARTY)
        let swingVotes = 0
        if (swingParty)
          swingVotes = Math.round(
            (Number(row.TOTAL_VOTES_POLLED) * swingParty.swing) / 100
          )
        return {
          ...row,
          VOTES:
            swingVotes !== 0
              ? Number(row.VOTES) + swingVotes
              : Number(row.VOTES)
        }
      })
      return newVoteShare
    })
  }
  return updateVotes.flat()
}
