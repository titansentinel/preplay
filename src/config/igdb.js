import dotenv from 'dotenv';
dotenv.config();

export default {
  clientId: process.env.IGDB_CLIENT_ID,
  clientSecret: process.env.IGDB_CLIENT_SECRET,
  twitchTokenUrl: 'https://id.twitch.tv/oauth2/token',
  igdbApiUrl: 'https://api.igdb.com/v4'
};
