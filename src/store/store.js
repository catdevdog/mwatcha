import { defineStore } from "pinia";

export const useStore = defineStore("store", {
  state: () => ({
    currentChannel: null,
    currentPlaylist: null,
    currentVideo: null,
  }),
  actions: {
    setCurrentChannel(channel) {
      this.currentChannel = channel;
    },
    setCurrentPlaylist(playlist) {
      this.currentPlaylist = playlist;
    },
    setCurrentVideo(video) {
      this.currentVideo = video;
    },
  },
  getters: {
    getCurrentChannel() {
      return this.currentChannel;
    },
    getCurrentPlaylist() {
      return this.currentPlaylist;
    },
    getCurrentVideo() {
      return this.currentVideo;
    },
  },
});
