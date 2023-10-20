const months: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const TimestampParser = (
  timestamp: string,
  type: "descriptive" | "YYYY-MM-DD" | "relative"
): string => {
  switch (type) {
    case "descriptive": {
      const _unix: Date = new Date(timestamp);

      const _minutes = _unix.getMinutes();
      const _hours = _unix.getHours();
      const _seconds = _unix.getSeconds();
      const _parsedSeconds: string = `${_seconds <= 9 ? "0" : ""}${_seconds}`;
      const _parsedMinutes: string = `${_minutes <= 9 ? "0" : ""}${_minutes}`;
      const _parsedHours: string = `${_hours <= 9 ? "0" : ""}${_hours}`;

      return `${
        months[_unix.getMonth()]
      } ${_unix.getDate()} ${_unix.getFullYear()} at ${_parsedHours}:${_parsedMinutes}:${_parsedSeconds}`;
    }

    case "YYYY-MM-DD": {
      const date = new Date(timestamp);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }

    case "relative": {
      const currentTime = new Date();
      const pastTime = new Date(timestamp);

      const yearsDifference =
        currentTime.getFullYear() - pastTime.getFullYear();
      const monthsDifference = currentTime.getMonth() - pastTime.getMonth();
      const daysDifference = currentTime.getDate() - pastTime.getDate();
      const hoursDifference = currentTime.getHours() - pastTime.getHours();
      const minutesDifference =
        currentTime.getMinutes() - pastTime.getMinutes();

      if (yearsDifference > 0) {
        return `${yearsDifference} year${yearsDifference > 1 ? "s" : ""} ago`;
      } else if (monthsDifference > 0) {
        return `${monthsDifference} month${
          monthsDifference > 1 ? "s" : ""
        } ago`;
      } else if (daysDifference > 0) {
        return `${daysDifference} day${daysDifference > 1 ? "s" : ""} ago`;
      } else if (hoursDifference > 0) {
        return `${hoursDifference} hour${hoursDifference > 1 ? "s" : ""} ago`;
      } else if (minutesDifference > 0) {
        return `${minutesDifference} minute${
          minutesDifference > 1 ? "s" : ""
        } ago`;
      } else {
        return `just now`;
      }
    }

    default: {
      return "error";
    }
  }
};
