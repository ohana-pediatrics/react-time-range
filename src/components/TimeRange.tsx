import React, {ChangeEventHandler, Component, MouseEventHandler, ReactNode} from "react";
import classnames from 'classnames';
import {generateTimeObjects, manipulateTimeObject, TimeModel} from "./timeModel";
import TimeComponent from "./TimeComponent";
import "../styles.css";

type Props = {
  use24Hours: boolean,
  startLabel: string,
  endLabel: string,
  startMoment: string,
  endMoment: string,
  minuteIncrement: 1 | 2 | 5 | 10 | 15 | 20 | 30 | 60,
  sameIsValid: boolean,
  className?: string,
  onClick: MouseEventHandler ,
  onChange: ({}) => void,
  showErrors: boolean,
  equalTimeError: string,
  endTimeError: string,
  onStartTimeClick: MouseEventHandler,
  onStartTimeChange: ({}) => void,
  onEndTimeClick: MouseEventHandler,
  onEndTimeChange: ({}) => void,
  children?: ReactNode
};

type State = {
  timeModel: TimeModel
}

export class TimeRange extends Component<Props, State> {
  static defaultProps = {
    use24Hours: false,
    sameIsValid: true,
    minuteIncrement: 30,
    startLabel: "Start:",
    endLabel: "End:",
    showErrors: true,
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
    onClick: () => {
    },
  };

  state: State = {
    timeModel: generateTimeObjects(this.props)
  };

  changeTime = (type: 'start' | 'end'): ChangeEventHandler<HTMLSelectElement> => (evt) => {
    // Fetch our current start and end time values
    const result = {
      startTime: this.props.startMoment,
      endTime: this.props.endMoment,
    };

    const index= type === 'start' ? 'startTime' : 'endTime';

    result[index] = manipulateTimeObject(result[index], evt.target.value);
    if (type === 'start') {
      this.props.onStartTimeChange({startTime: result.startTime})
    } else {
      this.props.onEndTimeChange({endTime: result.endTime})
    }

    // Return both time objects back
    this.props.onChange(result);
  };

  componentClicked = (type: string):MouseEventHandler => (e) => {
    // On Click Function regardless of component
    this.props.onClick && this.props.onClick(e);

    if (type === 'start') {
      this.props.onStartTimeClick(e)
    } else {
      this.props.onEndTimeClick(e)
    }
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
