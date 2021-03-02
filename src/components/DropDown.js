import Select from "react-select"
import makeAnimated from "react-select/animated"
import { yearOptions, yearDefaultSelect } from "../constants"

const DropDown = (props) => {
  const { onChange } = props
  const _handleChange = (e) => {
    onChange(e.value)
  }
  return (
    <div>
      <div className="flex justify-center">
        <div className="container max-w-xl mx-auto">
          <Select
            components={makeAnimated}
            placeholder="Select a Year"
            name="selectOptions"
            onChange={_handleChange}
            options={yearOptions}
            defaultValue={yearDefaultSelect}
            isSearchable
          />
        </div>
      </div>
    </div>
  )
}

export default DropDown
