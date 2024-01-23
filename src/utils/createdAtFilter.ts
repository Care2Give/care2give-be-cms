import moment from "moment";

export default function createdAtFilter(filter: string) {
  let createdAt = {};
  if (filter === "alltime") {
    createdAt = {};
  } else if (filter === "yearly") {
    createdAt = {
      gte: moment(new Date()).subtract(1, "y").toDate(),
    };
  } else if (filter === "monthly") {
    createdAt = {
      gte: moment(new Date()).subtract(1, "M").toDate(),
    };
  } else if (filter === "weekly") {
    createdAt = {
      gte: moment(new Date()).subtract(1, "w").toDate(),
    };
  } else if (filter === "daily") {
    createdAt = {
      gte: moment(new Date()).subtract(1, "d").toDate(),
    };
  }
  return createdAt;
}
