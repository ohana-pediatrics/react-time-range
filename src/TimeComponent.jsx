import React from "react";
import PropTypes from "prop-types";

const TimeComponent = ({label, calendar, timeValue, timeIncrement, use24Hours, onChange, onClick}) => {
  return (<div className="component start-component">
    {label && <span className="label">{label}</span>}
    {calendar && <span className="component">{calendar}</span>}
    <select
      value={timeValue}
      onChange={onChange}
      onClick={onClick}
    >
      {timeIncrement &&
        timeIncrement.map((resp, index) => (
          <option key={index} value={resp.value} disabled={!resp.active}>
            {use24Hours
              ? `${resp.HH}:${resp.MM}`
              : `${resp.hh}:${resp.mm} ${resp.period}`}
          </option>
        ))}
    </select>
  </div>);
};

TimeComponent.propTypes = {
  label: PropTypes.string,
  calendar: PropTypes.shape({}),
  timeValue: PropTypes.string,
  timeIncrement: PropTypes.arrayOf(PropTypes.shape({})),
  use24Hours: PropTypes.bool,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
};

export default TimeComponent;
