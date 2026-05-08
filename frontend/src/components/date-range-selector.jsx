import DatePicker from "react-datepicker";  //used ai to learn about this library and compare to alternatives
import "react-datepicker/dist/react-datepicker.css";

export default function DateRangeSelector({
  startDate,
  endDate,
  onChange,
  onApply,
  showApply = true,
}) {
  const handleStartChange = (date) => {
    onChange({ startDate: date, endDate });
  };

  const handleEndChange = (date) => {
    onChange({ startDate, endDate: date });
  };

  const handleClear = () => {
    onChange({ startDate: null, endDate: null });
  };

  const containerStyle = {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center",
  };

  const applyBtnStyle = {
    padding: "6px 12px",
    borderRadius: "5px",
    background: "#0066cc",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
  };

  const clearBtnStyle = {
    padding: "6px 12px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
    fontSize: "13px",
  };

  return (
    <div style={containerStyle}>
      <DatePicker
        selected={startDate}
        onChange={handleStartChange}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        showTimeSelect
        timeIntervals={15}
        placeholderText="Start Date & Time"
        dateFormat="MMM d, yyyy h:mm aa"
        aria-label="Start Date and Time"
      />
      <DatePicker
        selected={endDate}
        onChange={handleEndChange}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        showTimeSelect
        timeIntervals={15}
        placeholderText="End Date & Time"
        dateFormat="MMM d, yyyy h:mm aa"
        aria-label="End Date and Time"
      />
      {showApply && onApply && (
        <button onClick={onApply} style={applyBtnStyle} aria-label="Apply date range">
          Apply Filter
        </button>
      )}
      <button onClick={handleClear} style={clearBtnStyle} aria-label="Clear date range">
        Clear
      </button>
    </div>
  );
}
