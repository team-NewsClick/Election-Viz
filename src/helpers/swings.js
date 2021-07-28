import { STATE_UT_DEFAULT_SELECT } from "../constants"
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
  partyAlliance &&
    partyAlliance.map((d) => {
      alliances.add(d.ALLIANCE)
    })
  alliances.add("OTHERS")
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
  constituencyOptions,
  partiesSwing,
  electionViewType
) => {
    if (
      constituencyOptions.length !== 0 &&
      partiesSwing.length !== 0 &&
      selectedStateUT !== STATE_UT_DEFAULT_SELECT &&
      selectedYearData.length !== 0
    ) {
      const constituencies = constituencyOptions.slice(1)
      const totalVotesPolledData = calculateConstituencyVotesPolled(
        selectedYearData,
        selectedStateUT,
        constituencies,
        electionViewType
      )
      const swingState = calculateVoteShare(
        totalVotesPolledData,
        constituencies,
        partiesSwing,
        electionViewType
      )
      const allStates = selectedYearData.filter((state) => {
        return state.ST_NAME !== selectedStateUT
      })
      const swings = [...swingState, ...allStates]
      return swings
    }
}

/**
 * Calculate votes polled for the selected State/UT
 * @param {Array<Object>} selectedYearData Selected year data
 * @param {String} selectedStateUT Selected State/UT
 * @param {Array} constituencies Array of Constituencies of a State/UT
 * @returns {Array<Object>} Array of objects with calculated Votes Polled
 */
const calculateConstituencyVotesPolled = (
  selectedYearData,
  selectedStateUT,
  constituencies,
  electionViewType
) => {
  const selectedState = selectedYearData.filter((state) => {
    return state.ST_NAME === selectedStateUT
  })
  let totalVotes = []
  if(electionViewType === "general") {
    totalVotes = constituencies.map((constituency) => {
      const assemblyFilter = selectedState.filter((row) => {
        return row.PC_NAME === constituency
      })
      const total = assemblyFilter
        .map((row) => row.VOTES)
        .reduce((prev, next) => Number(prev) + Number(next), 0)
      const addedVotesArray = assemblyFilter.map((row) => {
        return {
          ...row,
          TOTAL_VOTES_POLLED: total
        }
      })
      return addedVotesArray
    })
  } else {
    totalVotes = constituencies.map((constituency) => {
      const assemblyFilter = selectedState.filter((row) => {
        return row.AC_NAME === constituency
      })
      const total = assemblyFilter
        .map((row) => row.VOTES)
        .reduce((prev, next) => Number(prev) + Number(next), 0)
      const addedVotesArray = assemblyFilter.map((row) => {
        return {
          ...row,
          TOTAL_VOTES_POLLED: total
        }
      })
      return addedVotesArray
    })
  }
  const totalVotesPolled = totalVotes.filter((row) => {
    return row.length !== 0
  })
  return totalVotesPolled.flat()
}

/**
 * Calculate total Vote Share
 * @param {Array<Object>} totalVotesPolledData Array of objects with total vote share calculated
 * @param {Array} constituencies Selected State/UT
 * @param {Array<Object>} partiesSwing Array of Objects, Swing Parties
 * @returns {Array<Object>} Array of objects with calculated Votes Share
 */
const calculateVoteShare = (
  totalVotesPolledData,
  constituencies,
  partiesSwing,
  electionViewType
) => {
  let updateVotes = []
  if(electionViewType === "general") {
    updateVotes = constituencies.map((constituency) => {
      const assemblyFilter = totalVotesPolledData.filter((row) => {
        return row.PC_NAME === constituency
      })
      const newVoteShare = assemblyFilter.map((row) => {
        const swingParty = partiesSwing.find((d) => d.PARTY === row.PARTY)
        let swingVotes = 0
        if (swingParty) {
          swingVotes = Math.round(
            (Number(row.TOTAL_VOTES_POLLED) * swingParty.swing) / 100
          )
        }
        return {
          ...row,
          VOTES:
            swingVotes !== 0 ? Number(row.VOTES) + swingVotes : Number(row.VOTES)
        }
      })
      return newVoteShare
    })
  } else {
    updateVotes = constituencies.map((constituency) => {
      const assemblyFilter = totalVotesPolledData.filter((row) => {
        return row.AC_NAME === constituency
      })
      const newVoteShare = assemblyFilter.map((row) => {
        const swingParty = partiesSwing.find((d) => d.PARTY === row.PARTY)
        let swingVotes = 0
        if (swingParty) {
          swingVotes = Math.round(
            (Number(row.TOTAL_VOTES_POLLED) * swingParty.swing) / 100
          )
        }
        return {
          ...row,
          VOTES:
            swingVotes !== 0 ? Number(row.VOTES) + swingVotes : Number(row.VOTES)
        }
      })
      return newVoteShare
    })
  }
  return updateVotes.flat()
}
