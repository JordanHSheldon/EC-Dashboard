import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store";
import { useState } from "react";
import { Peripheral } from "../../lib/definitions";
import Spinner from "../../Components/Spinner/spinner";
import './profile.css'

export default function Profile() {
  const { profile,IsLoggedIn } = useUserStore();
  const { updateProfile } = useUserStore();
  const navigate = useNavigate();
  const [peripherals,setPeripherals] = useState<Peripheral[]>()
  const [loading,setLoading] = useState(false);
  const [tab,setTab] = useState(1);

  useEffect(() => {
    if(!IsLoggedIn){
      navigate('/');
      return;
    } 
    GetPeripherals();
  }, [profile,updateProfile]);
 
  const toggleTab = (tabId: number) => {
    setTab(tabId);
  }

  async function GetPeripherals(): Promise<void> {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }

  async function handleMouseIdChange(e: string){
    if(profile) profile.mouseId = parseInt(e);
  }

  function handleMousepadIdChange(e: string){
    if(profile) profile.mousepadId = parseInt(e);
  }

  function handleKeyboardIdChange(e: string){
    if(profile) profile.keyboardId = parseInt(e);
  }

  function downloadConfig(){

  }

  function uploadConfig(){
    
  }

  if (loading) return <Spinner />;

  return (
    <div className="profile">
      <div className="profile-header">
          <div className="profile-picture">
            <img src={profile?.avatar}></img>
            <p>{profile?.userName}</p>
          </div> 
      </div>
      <div>
        <div className="tabs">
          <div className={tab === 1 ? "tab active" : "tab"} onClick={()=>toggleTab(1)}>Configs</div>
          <div className={tab === 2 ? "tab active" : "tab"} onClick={()=>toggleTab(2)}>Stats</div>
        </div>

        <div className={tab === 1 ? "tab-content active" : "tab-content"}>
          <div className="profile-peripherals">
            <button onClick={updateProfile}>SAVE</button>
            <div className="profile-peripheral">
                <p>Mouse</p>
                <select
                  id="Mouse-select"
                  onChange={(e) => handleMouseIdChange(e.target.value)}
                  defaultValue={profile?.mouseId}
                >
                  {peripherals
                    ?.filter(p => p.type === "Mouse" || p.type == "Default")
                    .map(option => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))
                  }
              </select>
            </div>
            <div className="profile-peripheral">
                <p>Mousepad</p>
                <select
                  id="Mousepad-select"
                  onChange={(e) => handleMousepadIdChange(e.target.value)}
                  defaultValue={profile?.mousepadId}
                >
                  {
                    peripherals?.filter((perihperal) => { 
                      return perihperal.type == "Mousepad" || perihperal.type == "Default"
                    })?.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>))
                  }
                </select>
            </div>
            <div className="profile-peripheral">
              <p>Keyboard</p>
              <select
                id="Mousepad-select"
                onChange={(e) => handleKeyboardIdChange(e.target.value)}
                defaultValue={profile?.keyboardId}
              >
                {
                  peripherals?.filter((perihperal) => { 
                    return perihperal.type == "Keyboard" || perihperal.type == "Default"
                  })?.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>))
                }
              </select>
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