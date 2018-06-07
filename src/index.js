import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import {generateTimeObjects, manipulateTimeObject} from "./timeModel";
import TimeComponent from "./TimeComponent";
import "./styles.css";


const HANDLERS = {
  click: {
    start: "onStartTimeClick",
    end: "onEndTimeClick",
  },
  change: {
    start: "onStartTimeChange",
    end: "onEndTimeChange",
  }
};

class TimeRange extends React.Component {
  static propTypes = {
    use24Hours: PropTypes.bool,
    startLabel: PropTypes.string,
    endLabel: PropTypes.string,
    startMoment: PropTypes.string.isRequired,
    endMoment: PropTypes.string.isRequired,
    minuteIncrement: PropTypes.oneOf([1, 2, 5, 10, 15, 20, 30, 60]),
    sameIsValid: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func,
    onChange: PropTypes.func,
    showErrors: PropTypes.bool,
    equalTimeError: PropTypes.string,
    endTimeError: PropTypes.string,
    onStartTimeClick: PropTypes.func,
    onStartTimeChange: PropTypes.func,
    onEndTimeClick: PropTypes.func,
    onEndTimeChange: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  };

  static defaultProps = {
    use24Hours: false,
    useCalendarChildren: false,
    sameIsValid: true,
    calendarChildren: 0,
    minuteIncrement: 30,
    startLabel: "Start:",
    endLabel: "End:",
    showErrors: true,
    repositionTimes: false,
    equalTimeError:
      "Please enter a valid time. Start and End times cannot be equal.",
    endTimeError:
      "Please enter a valid time. End time cannot be before start time.",
    onStartTimeChange: () => {
    },
    onEndTimeChange: () => {
    },
    onStartTimeClick: () => {
    },
    onEndTimeClick: () => {
    },
    onChange: () => {
    },
  };

  state = {
    timeModel: null
  };

  static getDerivedStateFromProps(nextProps) {
    return TimeRange.buildModel(nextProps);
  }

  static buildModel(props) {
    // Generate timeModel and store in our component state
    const timeModel = generateTimeObjects({...props});
    return {timeModel};
  }

  changeTime = type => (evt) => {
    // Fetch our current start and end time values
    const result = {
      startTime: this.props.startMoment,
      endTime: this.props.endMoment,
    };

    result[`${type}Time`] = manipulateTimeObject(result[`${type}Time`], evt.target.value);
    this.props[HANDLERS.change[type]]({
      [`${type}Time`]: result[`${type}Time`]
    });

    // Return both time objects back
    this.props.onChange(result);
  };

  componentClicked = type => () => {
    // On Click Function regardless of component
    this.props.onClick && this.props.onClick();

    this.props[HANDLERS.click[type]]();
  };

  render() {
    const {
      startLabel,
      endLabel,
      showErrors,
      className,
      use24Hours,
      children
    } = this.props;
    const {timeModel} = this.state;
    const calendar = React.Children.toArray(children);

    return (
      <div className={classnames([className, "react-time-range"])}>
        <TimeComponent
          label={startLabel}
          calendar={calendar[0]}
          timeValue={timeModel.startTimeValue}
          timeIncrement={timeModel.startTimeIncrement}
          use24Hours={use24Hours}
          onClick={this.componentClicked("start")}
          onChange={this.changeTime("start")}
        />
        <TimeComponent
          label={endLabel}
          calendar={calendar[1]}
          timeValue={timeModel.endTimeValue}
          timeIncrement={timeModel.endTimeIncrement}
          use24Hours={use24Hours}
          onClick={this.componentClicked("end")}
          onChange={this.changeTime("end")}
        />
        {showErrors &&
        timeModel.error && <div className="error">{timeModel.error}</div>}
      </div>
    );
  }
}

export default TimeRange;
