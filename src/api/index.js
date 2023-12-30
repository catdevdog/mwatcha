import axios from "axios";

const mwa = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/",
  // headers: {
  //   Authorization: process.env.VUE_APP_YT_API_KEY,
  // },
});

// cost per day limit - 10,000

export const getSearchVideos = async (count) => {
  // cost : 100
  try {
    const response = await mwa.get("search", {
      params: {
        part: "id",
        channelId: process.env.VUE_APP_CH_ID_MAMWA,
        maxResults: count,
        order: "date",
        key: process.env.VUE_APP_YT_API_KEY,
      },
    });

    return response.data.items;
  } catch (error) {
    console.error("채널 동영상 불러오기 에러:", error);
    throw error;
  }
};

export const getChannelVideos = async (param) => {
  // cost : 1
  try {
    const response = await mwa.get("playlistItems", {
      params: {
        ...param,
        key: process.env.VUE_APP_YT_API_KEY,
      },
    });

    return response.data.items;
  } catch (error) {
    console.error("채널 동영상 불러오기 에러:", error);
    throw error;
  }
};

export const getChannelPlaylists = async (param) => {
  // cost : 1
  try {
    const response = await mwa.get("playlists", {
      params: {
        ...param,
        key: process.env.VUE_APP_YT_API_KEY,
      },
    });

    return response.data.items;
  } catch (error) {
    console.error("채널 동영상 불러오기 에러:", error);
    throw error;
  }
};
