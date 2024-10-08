"use client"

import { useEffect, useState } from "react";
import { Profile } from "../lib/definitions";
import { useCookies } from 'next-client-cookies';
import './profile.css'
import Spinner from "../Components/Spinner/spinner";

export default function Page() {
  const cookieStore = useCookies();
  const user = cookieStore.get('user');
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setLoading] = useState(true)
  
  useEffect(() => {
    if (user) {
      GetProfileData(user);
    } else {
      setLoading(false);
    }
  }, [user]);
 
  if (isLoading) return <div style={{'color': 'rgb(198, 196, 196)','padding':'10em'}}><Spinner /></div>
  if (!profile) return <p style={{'color': 'rgb(198, 196, 196)','padding':'10em'}}>No profile data, check back later</p>

  async function GetProfileData(token: string): Promise<void> {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.url}/Data/GetUserProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const profileData: Profile = await response.json();
      setProfile(profileData);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="profile">
          <div className="header">
              <a href="/profile/edit/" className="edit-btn">Edit</a>
          </div>
          <div className="profile-info">
              <div className="profile-picture">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb51ZwKCKqU4ZrB9cfaUNclbeRiC-V-KZsfQ&s" alt="Profile Picture" />
                  <div className="connections">
                      {/* <a href="https://twitter.com/username" target="_blank">Twitter</a>
                      <a href="https://instagram.com/username" target="_blank">Instagram</a> */}
                  </div>
              </div>
              <div className="user-details">
                <h2>{profile?.userName}</h2>
                <p>{profile?.firstName} {profile?.lastName}</p>
              </div>
          </div>

          <hr />

          {/* Perihperals section */}
          <div className="additional-section">
              <h1>Peripherals</h1>
              <div className="additional-info">
                  <div className="additional-info-item">
                      <span className="info-label">Mouse:</span>
                      <span className="info-value">{profile?.mouse}</span>
                  </div>
                  <div className="additional-info-item">
                      <span className="info-label">MousePad:</span>
                      <span className="info-value">{profile?.mousePad}</span>
                  </div>
                  <div className="additional-info-item">
                      <span className="info-label">Keyboard:</span>
                      <span className="info-value">{profile?.keyBoard}</span>
                  </div>
                  <div className="additional-info-item">
                      <span className="info-label">Headset:</span>
                      <span className="info-value">{profile?.headSet}</span>
                  </div>
                  <div className="additional-info-item">
                      <span className="info-label">Monitor:</span>
                      <span className="info-value">{profile?.monitor}</span>
                  </div>
              </div>
          </div>

          <hr />

          {/* Another section below additional information */}
          <div className="more-section">
              
          </div>
          <br />
      </div>
  </>
);
}