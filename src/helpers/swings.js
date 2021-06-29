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
      newParty: false,
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
 * @param {Array<Object>} selectedStateUTData Selected year data
 * @param {String} selectedStateUT Selected State/UT
 * @param {Array} constituencyOptions Array of Constituencies of a State/UT
 * @param {Array<Object>} swingParties Array of Objects, Swing Parties
 * @returns {Array<Object>} Array of objects Swings
 */
export const calculateSwings = (
  selectedStateUTData,
  selectedStateUT,
  constituencyOptions,
  swingParties
) => {
  if (
    (constituencyOptions.length !== 0 && swingParties.length !== 0,
    selectedStateUT !== STATE_UT_DEFAULT_SELECT &&
      selectedStateUTData.length !== 0)
  ) {
    const constituencies = constituencyOptions.slice(1)
    const totalVotesPolledData = calculateConstituencyVotesPolled(
      selectedStateUTData,
      selectedStateUT,
      constituencies
    )
    const swings = calculateVoteShare(
      totalVotesPolledData,
      constituencies,
      swingParties
    )
    return swings
  }
}

/**
 * Calculate votes polled for the selected State/UT
 * @param {Array<Object>} selectedStateUTData Selected year data
 * @param {String} selectedStateUT Selected State/UT
 * @param {Array} constituencies Array of Constituencies of a State/UT
 * @returns {Array<Object>} Array of objects with calculated Votes Polled
 */
const calculateConstituencyVotesPolled = (
  selectedStateUTData,
  selectedStateUT,
  constituencies
) => {
  // console.log("selectedStateUTData: ", selectedStateUTData)
  console.log(Array.isArray(selectedStateUTData))

  const selectedState = selectedStateUTData.filter((state) => {
    return state.ST_NAME === selectedStateUT
  })
  const totalVotes = constituencies.map((constituency) => {
    const assemblyFilter = selectedState.filter((row) => {
      return row.AC_NAME === constituency
    })

    const total = assemblyFilter
      .map((row) => row.VOTES)
      .reduce((prev, next) => Number(prev) + Number(next), 0)

    const addedVotesArray = assemblyFilter.map((row) => {
      return {
        ...row,
        TOTAL_VOTES_POLLED: total,
      }
    })
    return addedVotesArray
  })
  const totalVotesPolled = totalVotes.filter((row) => {
    return row.length !== 0
  })
  return totalVotesPolled.flat()
}

/**
 * Calculate total Vote Share
 * @param {Array<Object>} totalVotesPolledData Array of objects with total vote share calculated
 * @param {Array} constituencies Selected State/UT
 * @param {Array<Object>} swingParties Array of Objects, Swing Parties
 * @returns {Array<Object>} Array of objects with calculated Votes Share
 */
const calculateVoteShare = (
  totalVotesPolledData,
  constituencies,
  swingParties
) => {
  const updateVotes = constituencies.map((constituency) => {
    const assemblyFilter = totalVotesPolledData.filter((row) => {
      return row.AC_NAME === constituency
    })
    const newVoteShare = assemblyFilter.map((row) => {
      const swingParty = swingParties.find((d) => d.PARTY === row.PARTY)
      let swingVotes = 0
      if (swingParty) {
        swingVotes = Math.round(
          (Number(row.TOTAL_VOTES_POLLED) * swingParty.swing) / 100
        )
      }
      return {
        ...row,
        VOTES:
          swingVotes !== 0 ? Number(row.VOTES) + swingVotes : Number(row.VOTES),
      }
    })
    return newVoteShare
  })
  return updateVotes.flat()
}
