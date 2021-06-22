export const getParams = (arr) => {
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

export const calculateSwings = (
  selectedYearData,
  selectedStateUT,
  constituencyOptions,
  swingParties
) => {
  if (constituencyOptions.length !== 0 && swingParties.length !== 0) {
    const constituencies = constituencyOptions.slice(1)
    const totalVotesPolledData = calculateConstituencyVotesPolled(
      selectedYearData,
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
const calculateConstituencyVotesPolled = (
  selectedYearData,
  selectedStateUT,
  constituencies
) => {
  const selectedState = selectedYearData.filter((state) => {
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
        TOTAL_VOTES_POLLED: total
      }
    })
    return addedVotesArray
  })
  const totalVotesPolled = totalVotes.filter((row) => {
    return row.length !== 0
  })
  return totalVotesPolled.flat()
}

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
      const swingParty = swingParties.find(d => d.party === row.PARTY)
      let swingVotes = 0
      if(swingParty) {
        swingVotes = Math.round((Number(row.TOTAL_VOTES_POLLED) * swingParty.swing) / 100)
      }
      return {
        ...row,
        VOTES: swingVotes !== 0 ? Number(row.VOTES) + swingVotes : Number(row.VOTES)
      }
    })
    return newVoteShare
  })
  return updateVotes.flat()
}