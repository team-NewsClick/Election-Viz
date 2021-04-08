/**
 * Loading Spinner
 * @returns {JSX.Element} Loading-Spinner
 */
const Loading = () => {
    return (
        <div
        // className="loading-container"
        style={{height: "100%", display: "flex", margin: "auto", overflow: "hidden"}}
        >
            <div className="loading-spinner" style={{fontSize: "6px"}} />
        </div>
    )
}

export default Loading
