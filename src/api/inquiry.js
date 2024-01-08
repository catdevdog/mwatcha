import { initFirebase } from "@/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  startAfter,
  limit,
  where,
  startAt,
  endAt,
} from "firebase/firestore";

const { db } = initFirebase();

/**
 * 공통 - 재생목록 영상 조회 함수
 * @param {
 *  playlistId: string[],
 *  videolimit: number,
 *  order: string[],
 *  next?: number ,
 *  nextLimit?: number
 * }
 *
 */
export const getClassifiedVideos = async (
  playListIds,
  videolimit,
  order,
  next,
  nextLimit = 10
) => {
  const docRef = collection(db, "VIDEOS");

  let q;

  q = query(
    docRef,
    where("playlistId", "in", playListIds),
    orderBy(order[0], order[1]),
    ...(next ? [startAfter(next)] : []),
    limit(next ? nextLimit : videolimit)
  );

  const querySnapshot = await getDocs(q);
  const nextStart = querySnapshot.docs[querySnapshot.docs.length - 1];

  const resultVideos = [];

  querySnapshot.forEach((doc) => {
    resultVideos.push(doc.data());
  });

  return {
    resultVideos,
    nextStart,
  };
};

/**
 * 공통 - 키워드 검색 조회 함수
 * @param {
 *  text: string
 *  videolimit: number,
 *  next?: number ,
 *  nextLimit?: number
 * }
 *
 */
export const getSearchVideos = async (
  text,
  videolimit,
  order,
  next,
  nextLimit = 10
) => {
  const docRef = collection(db, "VIDEOS");

  let q;

  q = query(
    docRef,
    orderBy("title"), // 제목 정렬
    startAt(text),
    endAt(text + "\uf8ff"),
    ...(next ? [startAfter(next)] : []),
    limit(next ? nextLimit : videolimit)
  );

  const querySnapshot = await getDocs(q);
  const nextStart = querySnapshot.docs[querySnapshot.docs.length - 1];

  const resultVideos = [];

  querySnapshot.forEach((doc) => {
    resultVideos.push(doc.data());
  });

  return {
    resultVideos,
    nextStart,
  };
};
