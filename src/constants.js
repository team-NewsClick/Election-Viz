/**
 * Default selection from general or assembly election
 */
export const ELECTION_VIEW_TYPE_DEFAULT = "general"

/**
 * Assembly Election
 */
export const ELECTION_VIEW_TYPE_ASSEMBLY = "assembly"

/**
 * Option when no particular State/UT is selected
 */
export const FIRST_SELECT_STATEUT = "First select a State/UT"

/**
 * Value of selectedStateUT when no State/UT is Selected
 */
export const SELECT_STATE_UT = "Select a State/UT"

/**
 * Value of selectedElection when no Election is Selected
 */
export const SELECT_ELECTION = "Select an Election"

/**
 * Value of selectedConstituencies when no constituencies is Available
 */
export const NO_CONSTITUENCIES = "No Constituencies"

/**
 * Live Election
 */
export const LIVE_ELECTION = "Live"

/**
 * Live Election Year
 */
export const LIVE_ELECTION_YEAR = "2021"

/**
 * Live Election Type
 */
export const LIVE_ELECTION_TYPE = "assembly"

/**
 * Live Election States/UTs
 */
export const LIVE_ELECTION_STATEUT = ["Kerala"]

/**
 * Upcoming Elections
 */
const UPCOMING_ELECTIONS = ["Rajasthan", "Maharashtra"]

/**
 * Election details: their type, year and state/UTs that had the election
 */
export const ELECTION_YEAR_STATEUT = {
  general: {
    2019: [
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jammu & Kashmir",
      "Karnataka",
      "Kerala",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Tripura",
      "Uttar Pradesh",
      "West Bengal",
      "Chhattisgarh",
      "Jharkhand",
      "Uttarakhand",
      "Telangana",
      "Andaman & Nicobar Islands",
      "Chandigarh",
      "Dadra & Nagar Haveli",
      "Daman & Diu",
      "NCT of Delhi",
      "Lakshadweep",
      "Puducherry"
    ],
    2014: [
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jammu & Kashmir",
      "Karnataka",
      "Kerala",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Tripura",
      "Uttar Pradesh",
      "West Bengal",
      "Chhattisgarh",
      "Jharkhand",
      "Uttarakhand",
      "Andaman & Nicobar Islands",
      "Chandigarh",
      "Dadra & Nagar Haveli",
      "Daman & Diu",
      "NCT of Delhi",
      "Lakshadweep",
      "Puducherry"
    ]
  },
  assembly: {
    2016: ["Assam", "Kerala", "Tamil Nadu", "West Bengal", "Puducherry"],
    2017: ["Uttar Pradesh"],
    2015: ["Bihar"],
    Upcoming: UPCOMING_ELECTIONS,
    // Live: LIVE_ELECTION_STATEUT
  }
}

/**
 * Distinct colors for states
 */
export const STATE_COLORS = [
  "#015069",
  "#349935",
  "#F29B34",
  "#774936",
  "#8E44AD",
  "C71E1D"
]

/**
 * List of all States and UTs
 */
export const STATE_UT_LIST = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Tripura",
  "Uttar Pradesh",
  "West Bengal",
  "Chhattisgarh",
  "Jharkhand",
  "Uttarakhand",
  "Telangana",
  "Andaman & Nicobar Islands",
  "Chandigarh",
  "Dadra & Nagar Haveli",
  "Daman & Diu",
  "NCT of Delhi",
  "Lakshadweep",
  "Puducherry"
]

/**
 * Time Delay for Live Update in Minutes
 */

export const DELAY_INTERVAL_MINUTES = 3

/**
 * Default Group type
 */
export const DEFAULT_GROUP_TYPE = "party"

/**
 * Options for Region
 */
export const REGION_OPTIONS = [
  {
    value: "All Regions",
    label: "All Regions"
  },
  {
    value: "Hindi Heartland",
    label: "Hindi Heartland"
  },
  {
    value: "North",
    label: "North"
  },
  {
    value: "East",
    label: "East"
  },
  {
    value: "North-East",
    label: "North-East"
  },
  {
    value: "South",
    label: "South"
  },
  {
    value: "West",
    label: "West"
  }
]

/**
 * Default Selection for Region
 * Default selection for region should be at REGION_OPTIONS[0]
 */
export const REGION_DEFAULT_SELECT = "All Regions"

/**
 * Default Selection for States/UTs
 */
export const STATE_UT_DEFAULT_SELECT = "All States & UTs"

/**
 * Default Selection for Constituencies
 */
export const CONSTITUENCIES_DEFAULT_SELECT = "All Constituencies"

/**
 * Default Selection for Seats Types
 */
export const SEAT_DEFAULT_SELECT = "All Seats"

/**
 * Options for Locality
 */
export const LOCALITY_OPTIONS = [
  {
    value: "All Localities",
    label: "All Localities"
  },
  {
    value: "Urban",
    label: "Urban"
  },
  {
    value: "Semi-Urban",
    label: "Semi-Urban"
  },
  {
    value: "Rural",
    label: "Rural"
  }
]

/**
 * Options for Community
 */
export const COMMUNITY_OPTIONS = [
  {
    value: "All Communitites",
    label: "All Communitites"
  },
  {
    value: "General",
    label: "General"
  },
  {
    value: "SC",
    label: "SC"
  },
  {
    value: "ST",
    label: "ST"
  },
  {
    value: "OBC",
    label: "OBC"
  },
  {
    value: "Other Communities",
    label: "Other Communities"
  }
]

/**
 * Options for Gender
 */
export const GENDER_OPTIONS = [
  {
    value: "All Genders",
    label: "All Genders"
  },
  {
    value: "Male",
    label: "Male"
  },
  {
    value: "Female",
    label: "Female"
  }
]

/**
 * Options for Education
 */
export const EDUCATION_OPTIONS = [
  {
    value: "All Education Levels",
    label: "All Education Levels"
  },
  {
    value: "Graduates",
    label: "Graduates"
  },
  {
    value: "Non-Graduates",
    label: "Non-Graduates"
  }
]

/**
 * Options for experience
 */
export const EXPERIENCE_OPTIONS = [
  {
    value: "All Experiences",
    label: "All Experiences"
  },
  {
    value: "Experienced",
    label: "Experienced"
  },
  {
    value: "Fresher",
    label: "Fresher"
  }
]

/**
 * Options for Criminality
 */
export const CRIMINALITY_OPTIONS = [
  {
    value: "All Criminality",
    label: "All Criminality"
  },
  {
    value: "Criminal Record",
    label: "Criminal Record"
  },
  {
    value: "No Criminal Record",
    label: "No Criminal Record"
  }
]

/**
 * Options for Seat Type
 */
export const SEAT_TYPE_OPTIONS = ["All Seats", "Reserved", "Unreserved"]

/**
 * Options for Voters Turnout
 */
export const VOTERS_TRUNOUT_OPTIONS = [
  {
    value: "vt-age",
    label: "Age"
  },
  {
    value: "vt-gender",
    label: "Gender"
  },
  {
    value: "vt-education",
    label: "Education"
  },
  {
    value: "vt-employement",
    label: "Employement"
  }
]

/**
 * Geojson Default Colors
 */
export const DEFAULT_STATE_FILL_COLOR = [255, 255, 255, 0]
export const DEFAULT_STATE_LINE_COLOR = [60, 60, 60, 255]
export const DEFAULT_DISTRICT_FILL_COLOR = [255, 255, 255, 125]
export const DEFAULT_DISTRICT_LINE_COLOR = [255, 255, 255, 255]
export const TRANSPARENT_COLOR = [255, 255, 255, 0]

/**
 * Default Party or Alliance Color
 */
export const DEFAULT_PARTY_ALLIANCE_COLOR = "#606060"

/**
 * State Names and Coordinates
 */
export const STATE_COORDINATES = [
  {
    state: "Andaman & Nicobar Islands",
    latitude: 10.5,
    longitude: 93,
    zoom: 5.8
  },
  {
    state: "Andhra Pradesh",
    latitude: 16.25,
    longitude: 80.75,
    zoom: 5.9
  },
  {
    state: "Arunachal Pradesh",
    latitude: 28.25,
    longitude: 94.5,
    zoom: 6.4
  },
  {
    state: "Assam",
    latitude: 26.75,
    longitude: 92.75,
    zoom: 6.2
  },
  {
    state: "Bihar",
    latitude: 26,
    longitude: 86,
    zoom: 6.5
  },
  {
    state: "Chandigarh",
    latitude: 30.75,
    longitude: 76.78,
    zoom: 10
  },
  {
    state: "Chhattisgarh",
    latitude: 21.0,
    longitude: 82.35,
    zoom: 6.2
  },
  {
    state: "Dadra & Nagar Haveli",
    latitude: 20.2,
    longitude: 73.1,
    zoom: 10
  },
  {
    state: "Daman & Diu",
    latitude: 20.4,
    longitude: 72.75,
    zoom: 10
  },
  {
    state: "NCT of Delhi",
    latitude: 28.67,
    longitude: 77.10,
    zoom: 9.5
  },
  {
    state: "Gujarat",
    latitude: 22.5,
    longitude: 71.25,
    zoom: 6.3
  },
  {
    state: "Goa",
    latitude: 15.35,
    longitude: 74,
    zoom: 8.6
  },
  {
    state: "Haryana",
    latitude: 29.5,
    longitude: 76.25,
    zoom: 7.0
  },
  {
    state: "Himachal Pradesh",
    latitude: 31.9,
    longitude: 77.25,
    zoom: 7
  },
  {
    state: "Jammu & Kashmir",
    latitude: 34.75,
    longitude: 76.5,
    zoom: 6.0
  },
  {
    state: "Jharkhand",
    latitude: 23.5,
    longitude: 85.75,
    zoom: 6.75
  },
  {
    state: "Karnataka",
    latitude: 15,
    longitude: 76.25,
    zoom: 6.2
  },
  {
    state: "Kerala",
    latitude: 10.5,
    longitude: 76.5,
    zoom: 6.7
  },
  {
    state: "Ladakh",
    latitude: 34.2,
    longitude: 76.5,
    zoom: 6.0
  },
  {
    state: "Lakshadweep",
    latitude: 10.5,
    longitude: 72.6,
    zoom: 6.5
  },
  {
    state: "Madhya Pradesh",
    latitude: 23.75,
    longitude: 78.5,
    zoom: 5.8
  },
  {
    state: "Maharashtra",
    latitude: 19.25,
    longitude: 76.65,
    zoom: 5.8
  },
  {
    state: "Manipur",
    latitude: 24.75,
    longitude: 94,
    zoom: 7.6
  },
  {
    state: "Meghalaya",
    latitude: 25.75,
    longitude: 91.25,
    zoom: 7.2
  },
  {
    state: "Mizoram",
    latitude: 23.5,
    longitude: 93,
    zoom: 7.2
  },
  {
    state: "Nagaland",
    latitude: 26.0,
    longitude: 94.5,
    zoom: 7.2
  },
  {
    state: "Odisha",
    latitude: 20,
    longitude: 84.65,
    zoom: 6.2
  },
  {
    state: "Puducherry",
    latitude: 11.25,
    longitude: 79.75,
    zoom: 8.0
  },
  {
    state: "Punjab",
    latitude: 31.0,
    longitude: 75.5,
    zoom: 7.2
  },
  {
    state: "Rajasthan",
    latitude: 27,
    longitude: 73.75,
    zoom: 5.8
  },
  {
    state: "Sikkim",
    latitude: 27.5,
    longitude: 88.5,
    zoom: 7.8
  },
  {
    state: "Tamil Nadu",
    latitude: 10.75,
    longitude: 78.5,
    zoom: 6.5
  },
  {
    state: "Telangana",
    latitude: 18.0,
    longitude: 79.5,
    zoom: 6.8
  },
  {
    state: "Tripura",
    latitude: 23.75,
    longitude: 91.75,
    zoom: 8.0
  },
  {
    state: "Uttar Pradesh",
    latitude: 27.25,
    longitude: 80.75,
    zoom: 6.0
  },
  {
    state: "Uttarakhand",
    latitude: 30.25,
    longitude: 79.25,
    zoom: 7
  },
  {
    state: "West Bengal",
    latitude: 24.5,
    longitude: 88.3,
    zoom: 6.4
  }
]

/**
 * Parties color
 */
export const PARTY_COLOR = [
  {
    party: "BJP",
    color: "#ED8918"
  },
  {
    party: "SP",
    color: "#E64A1D"
  },
  {
    party: "BSP",
    color: "#4171FE"
  },
  {
    party: "RLD",
    color: "#396502"
  },
  {
    party: "IUML",
    color: "#518D23"
  },
  {
    party: "KC(J)",
    color: "#CC990B"
  },
  {
    party: "TRS",
    color: "#E55672"
  },
  {
    party: "KC(M)",
    color: "#CC990B"
  },
  {
    party: "AGP",
    color: "#99CCFF"
  },
  {
    party: "KC(B)",
    color: "#CC990B"
  },
  {
    party: "AINRC",
    color: "#F7BF0E"
  },
  {
    party: "CMPKSC",
    color: "#FF0000"
  },
  {
    party: "BPF",
    color: "#BD0026"
  },
  {
    party: "ADMK",
    color: "#447603"
  },
  {
    party: "AITC",
    color: "#75C848"
  },
  {
    party: "Congress(Secular)",
    color: "#E97A7E"
  },
  {
    party: "JDS",
    color: "#00923F"
  },
  {
    party: "INC",
    color: "#5EA449"
  },
  {
    party: "CPI(M)",
    color: "#E64A1D"
  },
  {
    party: "CPM",
    color: "#E64A1D"
  },
  {
    party: "CPIM",
    color: "#E64A1D"
  },
  {
    party: "AIFB",
    color: "#DA461B"
  },
  {
    party: "GJM",
    color: "#7CD11B"
  },
  {
    party: "RSP",
    color: "#E54E47"
  },
  {
    party: "IND",
    color: "#A6A6A6"
  },
  {
    party: "DMK",
    color: "#DF481C"
  },
  {
    party: "NCP",
    color: "#5CB4B2"
  },
  {
    party: "CPI",
    color: "#E64A1D"
  },
  {
    party: "AIUDF",
    color: "#4A8118"
  },
  {
    party: "NSC",
    color: "#BD0026"
  },
  {
    party: "AD",
    color: "#FFA500"
  },
  {
    party: "AAP",
    color: "#1B66A4"
  },
  {
    party: "AAAP",
    color: "#1B66A4"
  },
  {
    party: "SBSP",
    color: "#F5D50A"
  },
  {
    party: "AD(S)",
    color: "#E36FCB"
  },
  {
    party: "TDP",
    color: "#FBEC23"
  },
  {
    party: "YSRCP",
    color: "#084202"
  },
  {
    party: "SHS",
    color: "#E96D1F"
  },
  {
    party: "RJD",
    color: "#4B8204"
  },
  {
    party: "BJD",
    color: "#396502"
  },
  {
    party: "SAD",
    color: "#EF9716"
  },
  {
    party: "LJP",
    color: "#3294DD"
  },
  {
    party: "JD(U)",
    color: "#255a8e"
  },
  {
    party: "RLSP",
    color: "#999966"
  },
  {
    party: "BLSP",
    color: "#999966"
  },
  {
    party: "JKPDP",
    color: "#4D8733"
  },
  {
    party: "JMM",
    color: "#447E5A"
  },
  {
    party: "JKNC",
    color: "#E64C3A"
  },
  {
    party: "INLD",
    color: "#3A6600"
  },
  {
    party: "JD(S)",
    color: "#006400"
  },
  {
    party: "BJP+",
    color: "#ED8918"
  },
  {
    party: "INC+",
    color: "#5EA449"
  },
  {
    party: "BSP-SP-RLD",
    color: "#0000FF"
  },
  {
    party: "LEFT",
    color: "#DE0000"
  },
  {
    party: "AIMIM",
    color: "#3A6C49"
  },
  {
    party: "AJSUP",
    color: "#DA251C"
  },
  {
    party: "SKM",
    color: "#E64A23"
  },
  {
    party: "SDF",
    color: "#FAEC0D"
  },
  {
    party: "NDPP",
    color: "#E64A21"
  },
  {
    party: "ADAL",
    color: "#E36FCB"
  },
  {
    party: "RLTP",
    color: "#DBE934"
  },
  {
    party: "JKN",
    color: "#FF0000"
  },
  {
    party: "BOPF",
    color: "#E8611C"
  },
  {
    party: "KEC(M)",
    color: "#CC990B"
  },
  {
    party : "NPF",
    color: "#bd678b"
  },
  {
    party: "NPEP",
    color: "#505d98"
  },
  {
    party: "MNF",
    color: "#2E5694"
  },
  {
    party: "VCK",
    color: "#427bb3"
  },
  {
    party: "KEC(J)",
    color: "#f76940"
  },
  {
    party: "KEC(B)",
    color: "f76940"
  },
  {
    party: "GOJAM",
    color: "#7CD11B"
  },
  {
    party: "HAMS",
    color: "#4B8204"
  }
]
