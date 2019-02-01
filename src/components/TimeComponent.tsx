import React, {ChangeEventHandler, FunctionComponent, MouseEventHandler, ReactNode} from "react";
import {Increment} from "./timeModel";

type Props = {
  label: string,
  calendar: ReactNode,
  timeValue: string,
  timeIncrement: Increment[],
  use24Hours: boolean,
  onChange: ChangeEventHandler,
  onClick: MouseEventHandler,
};


const TimeComponent: FunctionComponent<Props> = ({label, calendar, timeValue, timeIncrement, use24Hours, onChange, onClick}) => {
  return (<div className="component start-component">
    {label && <span className="label">{label}</span>}
    {calendar && <span className="component">{calendar}</span>}
    <select
      value={timeValue}
      onChange={onChange}
      onClick={onClick}
    >
      {timeIncrement &&
        timeIncrement.map((resp, index: number) => (
          <option key={index} value={resp.value} disabled={!resp.active}>
            {use24Hours
              ? `${resp.HH}:${resp.MM}`
              : `${resp.hh}:${resp.mm} ${resp.period}`}
          </option>
        ))}
    </select>
  </div>);
};

export default TimeComponent;
