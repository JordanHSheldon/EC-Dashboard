import { useEffect } from "react";
import { useState } from "react";
import { Peripheral, Profile } from "../../lib/definitions";
import Spinner from "../../Components/Spinner/spinner";
import { useNavigate } from "react-router-dom";
import './otherProfile.css'

export default function OtherProfile() {
    const [profile,setProfile] = useState<Profile | undefined>(undefined);
    const [peripherals,setPeripherals] = useState<Peripheral[]>()
    const [loading,setLoading] = useState(false);
    const [tab,setTab] = useState(1);
    const navigate = useNavigate();
    const userName = window.location.pathname.split('/').pop();

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await Promise.all([GetPeripherals(), GetProfileByUsernName()]);
            setLoading(false);
        };
        load();
    }, [userName]);

    const toggleTab = (tabId: number) => {
        setTab(tabId);
    }

    async function GetProfileByUsernName(): Promise<void> {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL+'api/Profile/GetProfileByUserName', {
                method: 'POST',
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({Username:userName})
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const Profile: Profile | undefined = await response.json();
            console.log(profile)
            setProfile(Profile);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    async function GetPeripherals(): Promise<void> {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL+'api/Peripheral/GetPeripherals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const profileData: Peripheral[] = await response.json();
            setPeripherals(profileData);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    if (userName === undefined) navigate('/');
    if (loading) return <Spinner />;

    return (
        <div className="other-profile">
        <div className="other-profile-header">
            <div className="other-profile-picture">
                <img src={profile?.avatar}></img>
                <h2>{profile?.username}</h2>
            </div> 
        </div>
        <div>
            <div className="tabs">
                <div className={tab === 1 ? "tab active" : "tab"} onClick={()=>toggleTab(1)}>Configs</div>
                <div className={tab === 2 ? "tab active" : "tab"} onClick={()=>toggleTab(2)}>Stats</div>
            </div>

            <div className={tab === 1 ? "tab-content active" : "tab-content"}>
                <div className="profile-peripherals">
                    <div className="profile-peripheral">
                        <p>Mouse</p>
                        <p>{peripherals?.filter(p => p.id === profile?.mouseId)?.map(p => p.name)}</p>
                    </div>
                    <div className="profile-peripheral">
                        <p>Mousepad</p>
                        <p>{peripherals?.filter(p => p.id === profile?.mousepadId)?.map(p => p.name)}</p>
                    </div>
                    <div className="profile-peripheral">
                        <p>Keyboard</p>
                        <p>{peripherals?.filter(p => p.id === profile?.keyboardId)?.map(p => p.name)}</p>
                    </div>
                </div>
            </div>
            <div className={tab === 2 ? "tab-content active" : "tab-content"}>
                <p>Statistics coming soon...</p>
            </div>
        </div>
        </div>
    );
}