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
  let allVideos = []; // 모든 동영상을 저장할 배열

  try {
    let nextPageToken = null;
    do {
      const response = await mwa.get("playlistItems", {
        params: {
          ...param,
          key: process.env.VUE_APP_YT_API_KEY,
          pageToken: nextPageToken, // 다음 페이지를 가져오기 위해 nextPageToken 추가
        },
      });

      const { items, nextPageToken: nextToken } = response.data;

      const videoIds = items.map((item) => item.snippet.resourceId.videoId);
      const videoResponse = await mwa.get("videos", {
        params: {
          part: "contentDetails, statistics",
          id: videoIds.join(","),
          key: process.env.VUE_APP_YT_API_KEY,
        },
      });

      const videoResult = items.map((item) => {
        let returnValue = {};
        videoResponse.data.items.forEach((video) => {
          if (
            item.contentDetails.videoId === video.id &&
            Object.keys(video).length
          ) {
            returnValue = {
              ...item,
              detail: video.statistics,
            };
          }
        });
        return returnValue;
      });

      // console.log("items", videoResult);
      // console.log(videoResponse.data);

      allVideos = [...allVideos, ...videoResult]; // 가져온 동영상들을 배열에 추가

      nextPageToken = nextToken; // 다음 요청을 위해 nextPageToken 업데이트
    } while (nextPageToken); // nextPageToken이 없을 때까지 반복

    return allVideos; // 모든 동영상이 담긴 배열 반환
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
