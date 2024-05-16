import { useState, useEffect } from "react";
import './HackathonCard.css';

interface Hackathon {
    url: string;
    backgroundImage: string;
    location: string;
    name: string;
    logo: string;
    virtual: boolean;
    hybrid: boolean;
}
const GenEmpty = ({ url, backgroundImage, hybrid, virtual, logo, name, location }:Hackathon) => {
    let eventType: string;
    if (virtual) {
        eventType = "Zdalnie";
    } else if (hybrid) {
        eventType = "Hybrydowo";
    } else {
        eventType = "Stacjonarnie";
    }
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="card" style={{
            backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
        }}>
        <span className="event-type"><b>{eventType}</b></span>
        <img src={logo} alt="logo" loading="lazy" style={{ objectFit: 'contain' }} />
        <h1 className="walter">{name}</h1>
        <footer>
          <span><b className="walter">{location}</b></span>
        </footer>
      </a>
    );
};

const UpcomingHachathons = () => {
    const emptyVal = {url: '#',backgroundImage:'/default_card_bg.png', hybrid:false, virtual:false, logo:'/loading.gif', name:'Ładowanie Zawartości', location:''} 
    const [hackathons, setHackathons] = useState([emptyVal, emptyVal, emptyVal, emptyVal, emptyVal, emptyVal])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/upcoming.json'); 
                const data: any = await res.json();
                const hackathons:any = []
                data.map((hackathon: any) => {
                    let eventType: string;
                    if (hackathon.virtual) {
                        eventType = "Zdalnie";
                    } else if (hackathon.hybrid) {
                        eventType = "Hybrydowo";
                    } else {
                        eventType = "Stacjonarnie";
                    }
                    hackathons.push({
                        url:hackathon.website,
                        backgroundImage:(hackathon.banner.includes('(') || hackathon.banner.includes(')')) ? '/default_card_bg.png' : hackathon.banner,
                        location:`${hackathon.city || ''}${hackathon.city && hackathon.state ? ', ' : ''}${hackathon.state || ''}${hackathon.state && hackathon.country ? ', ' : ''}${hackathon.country || ''}`,
                        name:hackathon.name,
                        logo:hackathon.logo,
                        eventType:eventType,
                    })
                })
                setHackathons(hackathons);
            } catch (error) {
                console.error('Fuck!', error);
            }
        };
    
        fetchData();
    }, []);

    return (
        <div className='upcoming-hackathons' id='scrollable-div'>
            {hackathons.map((hackathon, index) => <GenEmpty key={index} {...hackathon} />)}
        </div>
    );
};

export default UpcomingHachathons;