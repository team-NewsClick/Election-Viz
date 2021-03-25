/**
 * Default selection from general or assembly election
 */
export const ELECTION_TYPE_DEFAULT = "general"

/**
 * Options for Year for Assembly Elections
 */
export const ASSEMBLY_YEAR_OPTIONS = ["2016", "2015"]

/**
 * Options for Year for General Elections
 */
 export const GENERAL_YEAR_OPTIONS = ["2019", "2014"]

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
export const REGION_DEFAULT_SELECT = REGION_OPTIONS[0]

/**
 * Default Selection for States/UTs
 */
export const STATE_UT_DEFAULT_SELECT = "All States & UTs"

/**
 * Default Selection for Constituencies
 */
export const CONSTITUENCIES_DEFAULT_SELECT = "All Constituencies"

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
export const SEAT_TYPE_OPTIONS = [
  {
    value: "All Seats Type",
    label: "All Seats Type"
  },
  {
    value: "Gained",
    label: "Gained"
  },
  {
    value: "Reserved",
    label: "Reserved"
  },
  {
    value: "Lost",
    label: "Lost"
  }
]

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
  },
]


/**
 * State Names and Coordinates
 */
export const STATE_COORDINATES = [
  {
    state: "Andaman & Nicobar Island",
    latitude: 11.667,
    longitude: 92.7359
  },
  {
    state: "Andhra Pradesh",
    latitude: 14.7504291,
    longitude: 78.57002559
  },
  {
    state: "Arunachal Pradesh",
    latitude: 27.10039878,
    longitude: 93.61660071
  },
  {
    state: "Assam",
    latitude: 26.7499809,
    longitude: 94.21666744
  },
  {
    state: "Bihar",
    latitude: 25.78541445,
    longitude: 87.4799727
  },
  {
    state: "Chandigarh",
    latitude: 30.71999697,
    longitude: 76.78000565
  },
  {
    state: "Chhattisgarh",
    latitude: 22.09042035,
    longitude: 82.15998734
  },
  {
    state: "Dadra & Nagar Haveli",
    latitude: 20.26657819,
    longitude: 73.0166178
  },
  {
    state: "NCT of Delhi",
    latitude: 28.6699929,
    longitude: 77.23000403
  },
  {
    state: "Gujarat",
    latitude: 22.309425,
    longitude: 72.136230

  },
  {
    state: "Goa",
    latitude: 15.491997,
    longitude: 73.81800065
  },
  {
    state: "Haryana",
    latitude: 28.45000633,
    longitude: 77.01999101
  },
  {
    state: "Himachal Pradesh",
    latitude: 31.10002545,
    longitude: 77.16659704
  },
  {
    state: "Jammu & Kashmir",
    latitude: 34.083656,
    longitude: 74.797371
  },
  {
    state: "Jharkhand",
    latitude: 23.80039349,
    longitude: 86.41998572
  },
  {
    state: "Karnataka",
    latitude: 12.57038129,
    longitude: 76.91999711
  },
  {
    state: "Kerala",
    latitude: 10.850516,
    longitude: 76.27108
  },
  {
    state: "Ladakh",
    latitude: 34.209515,
    longitude: 77.615112
  },
  {
    state: "Lakshadweep",
    latitude: 10.56257331,
    longitude: 72.63686717
  },
  {
    state: "Madhya Pradesh",
    latitude: 21.30039105,
    longitude: 76.13001949
  },
  {
    state: "Maharashtra",
    latitude: 19.25023195,
    longitude: 73.16017493
  },
  {
    state: "Manipur",
    latitude: 24.79997072,
    longitude: 93.95001705
  },
  {
    state: "Meghalaya",
    latitude: 25.57049217,
    longitude: 91.8800142
  },
  {
    state: "Mizoram",
    latitude: 23.71039899,
    longitude: 92.72001461
  },
  {
    state: "Nagaland",
    latitude: 25.6669979,
    longitude: 94.11657019
  },
  {
    state: "Odisha",
    latitude: 19.82042971,
    longitude: 85.90001746
  },
  {
    state: "Puducherry",
    latitude: 11.93499371,
    longitude: 79.83000037
  },
  {
    state: "Punjab",
    latitude: 31.51997398,
    longitude: 75.98000281
  },
  {
    state: "Rajasthan",
    latitude: 26.44999921,
    longitude: 74.63998124
  },
  {
    state: "Sikkim",
    latitude: 27.3333303,
    longitude: 88.6166475
  },
  {
    state: "Tamil Nadu",
    latitude: 11.127123,
    longitude: 78.656891
  },
  {
    state: "Telangana",
    latitude: 17.123184,
    longitude: 79.208824
  },
  {
    state: "Tripura",
    latitude: 23.83540428,
    longitude: 91.27999914
  },
  {
    state: "Uttar Pradesh",
    latitude: 28.207609,
    longitude: 79.82666
  },
  {
    state: "Uttaranchal",
    latitude: 30.32040895,
    longitude: 78.05000565
  },
  {
    state: "West Bengal",
    latitude: 22.58039044,
    longitude: 88.32994665
  }
]

/**
 * Parties color
 */
export const PARTY_COLOR = [
 {
   party: 'BJP',
   color: '#F97D09'
  },
 {
   party: 'SP',
   color: '#FE6161'
  },
 {
   party: 'BSP',
   color: '#0000FF'
  },
 {
   party: 'RLD',
   color: '#FF0000'
  },
 {
   party: 'IUML',
   color: '#00FF00'
  },
 {
   party: 'KC(J)',
   color: '#BD0026'
  },
 {
   party: 'TRS',
   color: '#BD0026'
  },
 {
   party: 'KC(M)',
   color: '#BD0026'
  },
 {
   party: 'AGP',
   color: '#BD0026'
  },
 {
   party: 'KC(B)',
   color: '#BD0026'
  },
 {
   party: 'AINRCongress',
   color: '#BD0026'
  },
 {
   party: 'CMPKSC',
   color: '#FF0000'
  },
 {
   party: 'BPF',
   color: '#BD0026'
  },
 {
   party: 'ADMK',
   color: '#008D3C'
  },
 {
   party: 'AITC',
   color: '#69B800'
  },
 {
   party: 'Congress(Secular)',
   color: '#BD0026'
  },
 {
   party: 'JDS',
   color: '#008D3C'
  },
 {
   party: 'INC',
   color: '#138808'
  },
 {
   party: 'CPI(M)',
   color: '#DE0000'
  },
 {
   party: 'CPM',
   color: '#DE0000'
  },
 {
   party: 'CPIM',
   color: '#DE0000'
  },
 {
   party: 'AIFB',
   color: '#008D3C'
  },
 {
   party: 'GJM',
   color: '#BD0026'
  },
 {
   party: 'RSP',
   color: '#FF0000'
  },
 {
   party: 'IND',
   color: '#A6A6A6'
  },
 {
   party: 'DMK',
   color: '#BD0026'
  },
 {
   party: 'NCP',
   color: '#BD0026'
  },
 {
   party: 'CPI',
   color: '#DE0000'
  },
 {
   party: 'AIUDF',
   color: '#BD0026'
  },
 {
   party: 'NSC',
   color: '#BD0026'
  },
 {
   party: 'AD',
   color: '#FFA500'
  },
 {
   party: 'AAP',
   color: '#ffff99'
  },
 {
   party: 'AAAP',
   color: '#ffff99'
  },
 {
   party: 'SBSP',
   color: '#BD0026'
  },
 {
   party: 'AD(S)',
   color: '#008D3C'
  },
 {
   party: 'TDP',
   color: '#DEDE05'
  },
 {
   party: 'YSRCP',
   color: '#084202'
  },
 {
   party: 'SHS',
   color: '#FF6634'
  },
 {
   party: 'RJD',
   color: '#008000'
  },
 {
   party: 'BJD',
   color: '#006400'
  },
 {
   party: 'SAD',
   color: '#FFA500'
  },
 {
   party: 'LJP',
   color: '#28ECF3'
  },
 {
   party: 'JD(U)',
   color: '#28F361'
  },
 {
   party: 'RLSP',
   color: '#008000'
  },
 {
   party: 'BLSP',
   color: '#008000'
  },
 {
   party: 'JKPDP',
   color: '#084202'
  },
 {
   party: 'JMM',
   color: '#006400'
  },
 {
   party: 'JKNC',
   color: '#E92415'
  },
 {
   party: 'INLD',
   color: '#006400'
  },
 {
   party: 'JD(S)',
   color: '#006400'
  },
 {
   party: 'BJP+',
   color: '#F97D09'}
   , 
 {
   party: 'INC+',
   color: '#138808'}
   , 
 {
   party: 'BSP-SP-RLD',
   color: '#0000FF'}
   , 
 {
   party: 'LEFT',
   color: '#DE0000'
  }
]

