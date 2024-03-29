import axios from 'axios'
import Cookies from "universal-cookie";
const cookies = new Cookies();
// api urls
const getSettingsById = "https://localhost:44345/api/Data/GetDataByName"
const bearerToken = "bearer " + cookies.get("user");

// Get user settingsdata
const getCsgoData = async (x) => {
  let request = {
    username: x,
  };
  
  const response = await axios.post(getSettingsById, request,
   {
    headers: {
      Authorization: bearerToken
    }
   }
  );

  return response.data;
}

// const getCsgoDataById = async (x) => {
//   let request = {
//     Alias: x,
//   };

//   const response = await axios.post(getSettingsById, request, {
//     headers: {
//       Authorization: bearerToken
//     }
//   });

//   return response.data;
// }

const csgoDataService = {
  getCsgoData
}

export default csgoDataService;