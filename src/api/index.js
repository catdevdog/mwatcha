import axios from "axios";

const mwa = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/",
  // headers: {
  //   Authorization: process.env.VUE_APP_YT_API_KEY,
  // },
});

export const getSearchVideos = async (count) => {
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

export const getChannelVideos = async (id, count) => {
  try {
    const response = await mwa.get("playlistItems", {
      params: {
        part: "contentDetails",
        playlistId: id,
        maxResults: count,
        key: process.env.VUE_APP_YT_API_KEY,
      },
    });

    return response.data.items;
  } catch (error) {
    console.error("채널 동영상 불러오기 에러:", error);
    throw error;
  }
};

export const getChannelPlaylists = async () => {
  try {
    const response = await mwa.get("playlists", {
      params: {
        part: "snippet",
        channelId: process.env.VUE_APP_CH_ID_MAMWA,
        maxResults: 20,
        key: process.env.VUE_APP_YT_API_KEY,
      },
    });

    return response.data.items;
  } catch (error) {
    console.error("채널 동영상 불러오기 에러:", error);
    throw error;
  }
};
