const path = require("path")

module.exports = {
  turbopack: {
    resolveAlias: {
      // map "~" to the project "src" folder
      '~': path.join(__dirname, 'src'),
    },
  },
  env: {
    MAPBOX_BOX_ACCESS_TOKEN: process.env.MAPBOX_BOX_ACCESS_TOKEN,
    LIVE_ELECTION_URL:process.env.LIVE_ELECTION_URL,
    LIVE_GEN_ELECTION_URL:process.env.LIVE_GEN_ELECTION_URL
  }
}
