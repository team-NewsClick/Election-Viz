export const processByStateUT = (data, stateUT) => {
    console.log("utils: ", data)
  if (stateUT == "All States & UT") {
    return data
  } else {
    return data.filter((row) => {
      return row.ST_NAME == stateUT
    })
  }
}
