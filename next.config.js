const path = require("path")

module.exports = {
  target: "serverless",
  webpack: (config) => {
    config.resolve.alias["~"] = path.resolve(__dirname, "src")
    return config
  },
  env: {
    MAPBOX_BOX_ACCESS_TOKEN: process.env.MAPBOX_BOX_ACCESS_TOKEN,
    API_URL_CSV: process.env.API_URL_CSV
  }
}