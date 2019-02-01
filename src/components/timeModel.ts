import moment, {Moment} from "moment";

export type Increment = {
  value: string,
  HH: string,
  MM: string,
  hh: string,
  mm: string,
  active: boolean,
  period: "AM" | "PM"
}

export type TimeModel = {
  startTimeIncrement: Increment[],
  endTimeIncrement: Increment[],
  startTimeValue: string,
  endTimeValue: string,
  error: string
}

function validMoments(startMoment: Moment, endMoment: Moment) {
  return startMoment.isValid() && endMoment.isValid();
}

function validRange(startMoment: Moment, endMoment: Moment, sameIsValid: boolean) {
  if (startMoment.isSame(endMoment)) {
    if (!sameIsValid) {
      return "equal";
    } else {
      return null;
    }
  }
  return startMoment.isBefore(endMoment) ? "lesser" : "greater";
}

function generateTimeIncrement(minIncrementProp: number): Increment[] {
  // Create an array of all possible times that can be selected
  const minuteIncrement = 60 / minIncrementProp;
  let timeArray = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < minuteIncrement; j++) {
      const time: Increment = {
        value: ("0" + i).slice(-2) + ("0" + j * minIncrementProp).slice(-2),
        HH: ("0" + i).slice(-2),
        MM: ("0" + j * minIncrementProp).slice(-2),
        hh:
          i === 0
            ? "12"
            : (i === 12 ? "12" : i > 12 ? "0" + (i - 12) : "0" + i).slice(-2),
        mm: ("0" + j * minIncrementProp).slice(-2),
        active: true,
        period: i >= 12 ? "PM" : "AM"
      };
      timeArray.push(time);
    }
  }
  return timeArray;
}

function calculateRoundedTimeValue(moment: Moment, minIncrementProp : number) {
  // If we receive a moment value, find nearest time increment
  const roundedTime =
    Math.round((moment.hour() * 60 + moment.minutes()) / minIncrementProp) *
    minIncrementProp;
  return (
    ("0" + Math.floor(roundedTime / 60)).slice(-2) +
    ("0" + roundedTime % 60).slice(-2)
  );
}

type TimeModelOptions = {
  startMoment: string,
  endMoment: string,
  minuteIncrement: number,
  sameIsValid: boolean,
  equalTimeError: string,
  endTimeError: string,
}

export const generateTimeObjects = (props: TimeModelOptions): TimeModel => {
  let startTimeMoment,
    endTimeMoment,
    startTimeIncrement,
    endTimeIncrement,
    startTimeValue,
    endTimeValue,
    error;

  let startMomentObject = moment(props.startMoment);
  let endMomentObject = moment(props.endMoment);

  // Check if two moment objects are valid
  if (validMoments(startMomentObject, endMomentObject)) {
    startTimeMoment = startMomentObject.set("seconds", 0);
    endTimeMoment = endMomentObject.set("seconds", 0);
  } else {
    startTimeMoment = moment().set("hour", 8);
    endTimeMoment = moment().set("hour", 10);
  }
  startTimeValue = calculateRoundedTimeValue(
    startTimeMoment,
    props.minuteIncrement
  );
  endTimeValue = calculateRoundedTimeValue(
    endTimeMoment,
    props.minuteIncrement
  );

  // Set our moment objects hours and minutes to the rounded time value
  startMomentObject.set("hour", parseInt(startTimeValue.substring(0, 2)));
  startMomentObject.set("minutes", parseInt(startTimeValue.substring(2, 4)));
  startMomentObject.set("seconds", 0);
  endMomentObject.set("hour", parseInt(endTimeValue.substring(0, 2)));
  endMomentObject.set("minutes", parseInt(endTimeValue.substring(2, 4)));
  endMomentObject.set("seconds", 0);

  // Confirm if start and end times are valid ranges
  const validity = validRange(
    startTimeMoment,
    endTimeMoment,
    props.sameIsValid
  );
  if (!props.sameIsValid) {
    if (validity === "equal") {
      error = props.equalTimeError;
    } else if (validity === "greater") {
      error = props.endTimeError;
    } else {
      error = null;
    }
  } else if (validity === "greater") {
    error = props.endTimeError;
  }

  // Calculate time increments
  startTimeIncrement = generateTimeIncrement(props.minuteIncrement);
  endTimeIncrement = generateTimeIncrement(props.minuteIncrement);

  // Return times back to the select object
  return {
    startTimeIncrement,
    endTimeIncrement,
    startTimeValue,
    endTimeValue,
    error: error || ''
  };
};

export const manipulateTimeObject = (momentObject: string, newTimeValue: string) => {
  let time = moment(momentObject);
  time.set("hour", parseInt(newTimeValue.substring(0, 2)));
  time.set("minutes", parseInt(newTimeValue.substring(2, 4)));
  time.set("seconds", 0);
  return time.toISOString();
};
