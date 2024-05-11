import type { FunctionalComponent } from 'preact';
import 'cal-heatmap/cal-heatmap.css';
import { render } from 'astro/compiler-runtime';
import CalHeatmap from 'cal-heatmap';


interface Hackathon {
    id: string,
    name: string,
    website: string,
    start: string,
    end: string,
    createdAt: string,
    logo: string,
    banner: string,
    city: string,
    state: string,
    country: string,
    countryCode: string,
    latitude: number,
    longitude: number,
    virtual: boolean,
    hybrid: boolean,
    mlhAssociated: boolean,
    apac: boolean
}


const cal = new (CalHeatmap as any)();
cal.paint({
  range: 24,
  domain: {
    type: 'month',
    padding: [20,0,30,0],
    gutter: -15,
    label: {
      text: 'MMM YYYY',
    }
  },
  subDomain: {
    type: 'day',
    width: 15,
    height: 15,
    radius: 5,
  },
  date: {
    start: new Date(new Date().getFullYear(), 1, 1),
    min: new Date(new Date().getFullYear()-2, 1, 1),
    max: new Date(new Date().getFullYear()+2, 0, 31),
  },
  data: {
    x: (datum: Hackathon) => {
      return +new Date(datum['start']);
      },
    y: (ran:number) => {
      return Math.random() * 30;
    },
    defaultValue: null,
  },
  scale: {
    color: {
      range: ['#79009e', '#ff9524'],
      interpolate: 'hsl',
      type: 'linear',
      domain: [0, 30],
    }
  }
});

const cachedData = localStorage.getItem('mergedData');
const cacheTime = localStorage.getItem('cacheTime');
const isCacheValid = cacheTime && new Date().getTime() - Number(cacheTime) < 4 * 60 * 60 * 1000;

let mergedData;
if (cachedData && isCacheValid) {
  // Use cached data
  mergedData = JSON.parse(cachedData);
} else {
  // Fetch data
  const zajecia = await fetch('/api/classes.json').then(res => res.json());
  cal.fill(zajecia);
  const data = await fetch('/api/hackathons.json').then(res => res.json());
  mergedData = [...zajecia, ...data];

  // Cache data
  localStorage.setItem('mergedData', JSON.stringify(mergedData));
  localStorage.setItem('cacheTime', String(new Date().getTime()));
}

cal.fill(await mergedData);
render(cal, document.getElementById('cal-heatmap'));