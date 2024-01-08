import axios from "axios";
import {
  doc,
  getDocs,
  collection,
  setDoc,
  orderBy,
  limit,
  startAfter,
  query,
  updateDoc,
} from "firebase/firestore";
import { initFirebase } from "@/firebase";
const { db } = initFirebase();

const mwa = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/",
});

const mwazzk = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/",
});

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

// 동영상 데이터를 가져오는 함수
const fetchVideoDetails = async (videoIds) => {
  try {
    const videoResponse = await mwa.get("videos", {
      params: {
        part: "contentDetails, statistics",
        id: videoIds.join(","),
        key: process.env.VUE_APP_YT_API_KEY,
      },
    });

    // API 응답에서 받은 동영상 데이터를 객체로 변환하여 반환
    return videoResponse.data.items.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
  } catch (error) {
    console.error("동영상 데이터 가져오기 에러:", error);
    throw error;
  }
};

// 각 동영상과 해당 동영상의 상세 데이터를 매핑하여 반환하는 함수
const getVideoWithDetails = (item, videoDetails) => {
  const videoDetail = videoDetails[item.snippet.resourceId.videoId];

  // 매칭되는 동영상 상세 데이터가 있으면 해당 데이터와 함께 새로운 객체를 반환
  if (videoDetail && Object.keys(videoDetail).length) {
    return {
      ...item,
      detail: videoDetail.statistics,
    };
  }

  return null;
};

// 채널의 모든 동영상을 가져오는 함수
export const getChannelVideos = async (param) => {
  try {
    let allVideos = [];

    let nextPageToken = null;

    // 모든 페이지의 동영상을 가져오기 위한 반복문
    do {
      const response = await mwa.get("playlistItems", {
        params: {
          ...param,
          key: process.env.VUE_APP_YT_API_KEY,
          pageToken: nextPageToken,
        },
      });

      const { items, nextPageToken: nextToken } = response.data;
      const videoIds = items.map((item) => item.snippet.resourceId.videoId);

      // 동영상 데이터를 가져오는 비동기 함수 호출
      const videoDetails = await fetchVideoDetails(videoIds);

      // 각 동영상에 대한 상세 정보를 비동기적으로 매핑하고 필터링하여 새로운 배열로 반환
      const videoResult = await Promise.all(
        items
          .map((item) => getVideoWithDetails(item, videoDetails))
          .filter(Boolean)
      );

      // 모든 동영상을 하나의 배열로 합치기
      allVideos = [...allVideos, ...videoResult];
      nextPageToken = nextToken;
    } while (nextPageToken);

    return allVideos; // 모든 동영상을 담고 있는 배열 반환
  } catch (error) {
    console.error("채널 동영상 불러오기 에러:", error);
    throw error;
  }
};

// 채널의 재생목록 반환
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

// YT 모든 데이터 조회
export const getYouTubeDatas = async (channelId) => {
  console.log("조회 시작");
  const playList = await getPlayList(channelId);
  playList.forEach(async (play) => {
    await setDoc(doc(db, "PLAYLIST", play.id), {
      ...play,
      open: true,
    }); // PLAYLIST에 입력

    // 재생 목록 기반으로 동영상 조회후 VIDEOS에 입력
    const videos = await getPlayListVideos(play.id);
    console.log(videos);
    videos.forEach(async (video) => {
      await setDoc(
        doc(db, "VIDEOS", `${play.id}-${video.contentDetails.videoId}`),
        {
          videoId: video.contentDetails.videoId,
          title: video.snippet.title,
          date: video.contentDetails.videoPublishedAt,
          channelTitle: video.snippet.channelTitle,
          channelId: video.snippet.channelId,
          playlistId: play.id,
          commentCount: Number(video.detail.commentCount),
          favoriteCount: Number(video.detail.favoriteCount),
          likeCount: Number(video.detail.likeCount),
          viewCount: Number(video.detail.viewCount),
          thumbnail: video.snippet.thumbnails,
        }
      ); // VIDEOS에 입력
    });
  });
  onUpdateDt(channelId);
  console.log("조회 완료");
};

// 채널 id를 받아 재생목록 조회
export const getPlayList = async (channelId) => {
  const param = {
    part: "id, snippet,status,contentDetails",
    channelId: channelId,
    maxResults: 20,
  };
  return await getChannelPlaylists(param);
};

// 재생목록 id를 받아 동영상 조회 함수 -- common
const getPlayListVideos = async (playListId) => {
  const param = {
    part: "snippet,contentDetails",
    playlistId: playListId,
    maxResults: 50,
  };
  return await getChannelVideos(param);
};

// 조회 완료 후 채널에 완료 시각 업데이트
const onUpdateDt = async (channelId) => {
  await updateDoc(doc(db, "CHANNEL_ID", channelId), {
    lastUpdateDt: +new Date(),
  });
};
