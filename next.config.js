const path = require("path")

module.exports = {
  webpack: (config) => {
    config.resolve.alias["~"] = path.resolve(__dirname, "src")
    return config
  },
  env: {
    MAPBOX_BOX_ACCESS_TOKEN: process.env.MAPBOX_BOX_ACCESS_TOKEN,
    LIVE_ELECTION_URL:process.env.LIVE_ELECTION_URL,
    LIVE_GEN_ELECTION_URL:process.env.LIVE_GEN_ELECTION_URL
  }
}
