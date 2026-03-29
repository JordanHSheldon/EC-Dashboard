import React, { useEffect } from 'react';
import { Profile } from '../../lib/definitions';
import { useNavigate } from 'react-router-dom';
import './players.css';

const ProfileCard: React.FC<Profile> = ({id, username, avatar}) => {
  const navigate = useNavigate();

useEffect(() => {
}, [navigate]);

  return (
    <div id={`player-card-${id}`} className="player-card" onClick={()=> navigate(import.meta.env.BASE_URL + "u/"+username)}>
      <div className="imageContainer">
        <img src={avatar} alt={`${username}'s profile picture`} className={"profileImage"} />
      </div>
      <h2 className={"name"}>{username}</h2>
    </div>
  );
};

export default ProfileCard;