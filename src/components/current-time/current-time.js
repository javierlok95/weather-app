import "./current-time.css"

function formatTime(timeString) {
    const [hourString, minute, second] = timeString.split(":");
    const hour = +hourString % 24;
    return (hour % 12 || 12) + ":" + minute + ":" + second + (hour < 12 ? " A.M." : " P.M.");
}

const CurrentTime = ({ currentTime }) => {
    const currentTimeFormatted = formatTime(currentTime);
    return (
        <div className="timezone-city">
            <div className="detailed-time">
                <div className="current-time">Current Time of the City:</div>
                <div className="time-format">{currentTimeFormatted}</div>
            </div>
        </div>
    );
}

export default CurrentTime;