import CalHeatmap from "cal-heatmap";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import CalendarLabel from "cal-heatmap/plugins/CalendarLabel";
import "cal-heatmap/cal-heatmap.css";
import "./heatmap.css";
import { render } from "astro/compiler-runtime";

export default function Cal() {
  const place = document.getElementById("cal-heatmap");
  function generatePat(iter) {
    const events = [];
    const startDate = new Date(2024, 0, iter || 1);
    const endDate = new Date(2025, 11, 31);

    while (startDate <= endDate) {
      const eventDate = new Date(startDate);
      events.push({ start: eventDate });

      startDate.setDate(startDate.getDate() + 3); // increment the date by 2 days
    }

    return events;
  }

  const cal = new CalHeatmap();
  let data = generatePat();
  const hits = {};
  cal.paint(
    {
      range: 24,
      domain: {
        type: "month",
        padding: [0, 0, 0, 0],
        gutter: -15,
        label: {
          text: "MMM YYYY",
        },
      },
      subDomain: {
        type: "day",
        width: 15,
        height: 15,
        radius: 5,
      },
      date: {
        start: new Date(new Date().getFullYear(), 1, 1),
        min: new Date(new Date().getFullYear() - 2, 1, 1),
        max: new Date(new Date().getFullYear() + 2, 0, 31),
        highlight: [new Date()]
      },
      data: {
        source: data,
        x: (datum) => {
          return +new Date(datum["start"]);
        },
        y: (val) => {
          const ran = Math.random() * 30;
          hits[ran] = val["name"]
          return ran;
        },
        defaultValue: null,
      },
      scale: {
        color: {
          range: ["#79009e", "#ff9524"],
          interpolate: "hsl",
          type: "linear",
          domain: [0, 30],
        },
      },
    },
    [
      [
        Tooltip,
        {
          text: function (timestamp, value, dayjsDate) {
              return hits[value] || "No events";
          },
        },
      ],
      [
        CalendarLabel,
        {
          position: "left",
          key: "left",
          text: () => ["Pon", "", "", "Czw", "", "", "Ndz"],
          textAlign: "middle",
          width: 30,
          padding: [0, 5, 0, 0],
        },
      ],
    ]
  );
  render(cal, place);

  async function fetchEvents() {
    const classes = await fetch("/api/classes.json").then((res) => res.json());
    const hack = await fetch("/api/hackathons.json").then((res) => res.json());
    classes.forEach((e) => {
      e.value = e.name;
    });
    hack.forEach((e) => {
      e.value = e.name;
    });
    data = [...classes, ...hack];
    return data;
  }
  let intervalId;
  
  const fetchData = async () => {
    let iter = 2
    intervalId = setInterval(() => {
      cal.fill(generatePat(iter++));
      if (iter > 6) {
        iter = 1;
      }
    }, 150);

    const data = await fetchEvents();
    clearInterval(intervalId); 
    cal.fill(data);
  };

  fetchData();
  return;
}
