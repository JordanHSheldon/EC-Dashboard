import { useEffect, useState } from "react";
import { Profile } from "../../lib/definitions";
import ProfileCard from "./Profilecard";
import Spinner from "../../Components/Spinner/spinner";
import NoDataFound from "../../Components/NoData/NoDataFound";
import './players.css'

export default function Players() {
  const pagination = 10;
  const [data, setData] = useState<Profile[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
      name: ''
  });

  useEffect(() => {
    GetPaginatedUsers(0, pagination);
  }, [pagination]);

  if (loading) return <Spinner />;
  if (!data) return <NoDataFound />

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target);
    const { name, value } = e.target;
    console.log(e.target.value)
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredData = data?.filter((profile) => {
    return profile?.username?.toLowerCase().includes(filters.name.toLowerCase());
  });

  async function GetPaginatedUsers(offset: number, limit: number): Promise<void> {
    setLoading(true);
    try {
      const request = {
        Offset: offset,
        Limit: limit
      };

      const response = await fetch(import.meta.env.VITE_API_URL+'api/Profile/GetPaginatedProfiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const profileData: Profile[] = await response.json();
      setData(profileData);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="players-page">
      <div className="chat-input">
        <input id="search-input"
              type="text" 
              onChange={handleFilterChange}
              >
        </input>
        <button className="send-btn">
          ➤
        </button>
      </div>

      <div className="players-flex-Box">
        {filteredData.map((profile) => (
            <ProfileCard id={profile.id}
                        key={profile.username}
                        username={profile.username} 
                        mouseId={profile.mouseId} 
                        mousepadId={profile.mousepadId} 
                        keyboardId={profile.keyboardId}
                        avatar={profile.avatar} />
        ))}
      </div>
    </div>
  );
}
