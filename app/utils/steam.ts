import * as SteamID from "@node-steam/id";
import axios from "axios";

const RESOLVE_VANITY_URL = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${process.env.STEAM_API_KEY}&vanityurl=`;
const PROFILE_URL = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=`;

export async function fetchProfile(data) {
  const parsedSteam = await getSteamID64FromString(data);
  if (!parsedSteam) {
    throw new Error(
      "Não foi possível encontrar um usuário com os dados inseridos."
    );
  }
  const userData = await axios.get(PROFILE_URL + parsedSteam.steamid64);
  userData.data.response.players[0].steamid = parsedSteam.steamid;
  userData.data.response.players[0].steamid64 = parsedSteam.steamid64;
  return userData;
}

interface SteamReturn {
  steamid?: string;
  steamid64: string;
}
const getSteamID64FromString = async (data) => {
  let returnData: SteamReturn = {
    steamid64: "",
  };

  if (data.length === 17) {
    returnData.steamid64 = data;
    return returnData;
  }
  const regexList = [
    {
      name: "steamid3",
      regex: new RegExp("^U\\:\\d\\:\\d+$"),
    },
    {
      name: "steamid",
      regex: new RegExp("^STEAM_[0-5]:[01]:\\d+$"),
    },
    {
      name: "steamUrl",
      regex: new RegExp(
        "(?:https?:\\/\\/)?steamcommunity\\.com\\/(?:profiles)\\/[a-zA-Z0-9]+"
      ),
    },
    {
      name: "steamCustomUrl",
      regex: new RegExp(
        "(?:https?:\\/\\/)?steamcommunity\\.com\\/(?:id)\\/[a-zA-Z0-9]+"
      ),
    },
  ];
  for (let reg of regexList) {
    if (reg.regex.test(data)) {
      if (reg.name === "steamid3" || reg.name === "steamid") {
        returnData.steamid = new SteamID.ID(data).getSteamID2();
        returnData.steamid64 = new SteamID.ID(data).getSteamID64();
      } else if (reg.name === "steamUrl") {
        returnData.steamid64 = data.split("/")[4];
        returnData.steamid = new SteamID.ID(data.split("/")[4]).getSteamID2();
      } else if (reg.name === "steamCustomUrl") {
        const vanity = data.split("/")[4];
        const vanityResult = await axios.get(RESOLVE_VANITY_URL + vanity);
        returnData.steamid64 = vanityResult.data.response.steamid;
        returnData.steamid = new SteamID.ID(
          vanityResult.data.response.steamid
        ).getSteamID2();
      }
    }
  }
  return returnData;
};
