<!-- src/pages/Search.vue -->

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "@/store/store"; // Pinia 스토어 임포트
import { storeToRefs } from "pinia"; // storeToRefs를 pinia에서 임포트
import Fuse from "fuse.js"; // Fuse.js 임포트
import MwaPlayer from "@/components/MwaPlayer.vue";

// 라우트와 스토어 인스턴스 생성
const route = useRoute();
const store = useStore();

// store의 allVideos를 refs로 분리
const { allVideos } = storeToRefs(store);

// 반응형 데이터 정의
const searchValue = ref(""); // 검색어
const searchResults = ref([]); // 검색 결과
const videoList = ref([]); // 최종 비디오 목록
const isLoading = ref(false); // 로딩 상태
const error = ref(null); // 에러 상태

// Fuse.js 옵션 설정
const fuseOptions = {
  keys: ["title", "description"], // 검색할 필드 지정
  threshold: 0.5, // 매칭 민감도 (0.0 - 1.0)
  includeScore: true, // 점수 포함 여부
};

// Fuse 인스턴스 선언
let fuse;

// 검색 설정
const searchConfig = {
  maxResults: 200, // 검색 결과 최대 개수
  minScore: 0.5, // 최소 매칭 점수 (0-1)
};

/**
 * 검색어를 토큰화하는 함수
 * @param {string} term - 검색어
 * @returns {Array} - 토큰화된 검색어 배열
 */
const tokenizeSearchTerm = (term) => {
  return term
    .toLowerCase()
    .split(/[\s,]+/)
    .filter((token) => token.length > 0);
};

/**
 * 텍스트 매칭 점수를 계산하는 함수
 * @param {string} text - 비교할 텍스트
 * @param {Array} searchTerms - 검색어 토큰 배열
 * @returns {number} - 매칭 점수
 */
const calculateMatchScore = (text, searchTerms) => {
  if (!text) return 0;
  const normalizedText = text.toLowerCase();

  return (
    searchTerms.reduce((score, term) => {
      // 정확한 일치
      if (normalizedText.includes(term)) {
        score += 1;
      }
      // 부분 일치 (초성 검색 지원)
      else if (
        getInitialConsonants(normalizedText).includes(
          getInitialConsonants(term)
        )
      ) {
        score += 0.8;
      }
      // 유사도 검색 (레벤슈타인 거리 사용)
      else {
        const similarity =
          1 -
          levenshteinDistance(normalizedText, term) /
            Math.max(normalizedText.length, term.length);
        if (similarity > 0.6) {
          score += similarity * 0.5;
        }
      }
      return score;
    }, 0) / searchTerms.length
  );
};

/**
 * 초성 추출 함수
 * @param {string} text - 입력 텍스트
 * @returns {string} - 초성만 추출한 문자열
 */
const getInitialConsonants = (text) => {
  const CONSONANTS = {
    ㄱ: /[가-깋]/g,
    ㄲ: /[까-낗]/g,
    ㄴ: /[나-닣]/g,
    ㄷ: /[다-딯]/g,
    ㄸ: /[따-띻]/g,
    ㄹ: /[라-맇]/g,
    ㅁ: /[마-밓]/g,
    ㅂ: /[바-빟]/g,
    ㅃ: /[빠-삫]/g,
    ㅅ: /[사-싷]/g,
    ㅆ: /[싸-앃]/g,
    ㅇ: /[아-잏]/g,
    ㅈ: /[자-짛]/g,
    ㅉ: /[짜-찧]/g,
    ㅊ: /[차-칳]/g,
    ㅋ: /[카-킿]/g,
    ㅌ: /[타-팋]/g,
    ㅍ: /[파-핗]/g,
    ㅎ: /[하-힣]/g,
  };

  return text
    .split("")
    .map((char) => {
      for (const [consonant, regex] of Object.entries(CONSONANTS)) {
        if (regex.test(char)) return consonant;
      }
      return char;
    })
    .join("");
};

/**
 * 레벤슈타인 거리 계산 함수
 * @param {string} str1 - 첫 번째 문자열
 * @param {string} str2 - 두 번째 문자열
 * @returns {number} - 두 문자열 간의 레벤슈타인 거리
 */
const levenshteinDistance = (str1, str2) => {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // 삽입
        matrix[j - 1][i] + 1, // 삭제
        matrix[j - 1][i - 1] + cost // 교체
      );
    }
  }

  return matrix[str2.length][str1.length];
};

/**
 * 검색 실행 함수
 * Pinia 스토어에 저장된 모든 비디오 데이터를 사용하여 검색 수행
 * @param {string} searchTerm - 검색어
 */
const performSearch = (searchTerm) => {
  if (!searchTerm.trim()) {
    searchResults.value = [];
    videoList.value = [];
    return;
  }

  console.log(searchTerm);
  isLoading.value = true;
  error.value = null;

  try {
    const searchTerms = tokenizeSearchTerm(searchTerm);

    // Fuse.js를 사용하여 검색 수행
    const results = fuse.search(searchTerm);

    // 점수를 기반으로 필터링 및 정렬
    const scoredResults = results.map((result) => {
      const video = result.item;
      // 사용자 정의 매칭 점수 계산
      const titleScore = calculateMatchScore(video.title, searchTerms);
      const descriptionScore =
        calculateMatchScore(video.description, searchTerms) * 0.5;
      return {
        ...video,
        searchScore: titleScore + descriptionScore,
      };
    });

    // 최소 점수 이상인 결과만 필터링하고 점수순으로 정렬
    searchResults.value = scoredResults
      .filter((result) => result.searchScore >= searchConfig.minScore)
      .sort((a, b) => b.searchScore - a.searchScore)
      .slice(0, searchConfig.maxResults); // 최대 결과 개수 제한

    videoList.value = searchResults.value;
  } catch (err) {
    error.value = "검색 중 오류가 발생했습니다.";
    console.error("Search error:", err);
  } finally {
    isLoading.value = false;
  }
};

// 검색 결과 통계 계산
const searchStats = computed(() => ({
  total: searchResults.value.length,
  exactMatches: searchResults.value.filter((r) => r.searchScore === 1).length,
  partialMatches: searchResults.value.filter((r) => r.searchScore < 1).length,
}));

const searchLogic = () => {
  // 검색어를 URL 파라미터에서 추출
  const { params } = route;
  searchValue.value = params.search || "";
  // Fuse.js 인스턴스 초기화
  fuse = new Fuse(allVideos.value, fuseOptions); // allVideos는 ref이므로 .value 사용

  // 검색어가 있는 경우 검색 수행
  if (searchValue.value) {
    performSearch(searchValue.value);
  }
};

/**
 * 컴포넌트가 마운트될 때 초기화 및 검색 수행
 */
onMounted(async () => {
  searchLogic();
});

// 검색어가 변경될 때마다 performSearch 함수 호출 (실시간 검색)
watch(
  () => route.params.search,
  (newValue) => {
    searchLogic();
  }
);
</script>
<template>
  <div>
    <div class="title">
      <p>"{{ searchValue }}" 검색 결과</p>
      <div class="search-stats" v-if="!isLoading && searchResults.length">
        <span>전체 {{ searchStats.total }}개 결과</span>
        <span v-if="searchStats.exactMatches"
          >(정확한 일치: {{ searchStats.exactMatches }}개)</span
        >
      </div>
    </div>

    <div v-if="isLoading" class="loading">
      <p>검색 중...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="videoList.length">
      <div class="result">
        <div
          class="result-item"
          v-for="video in videoList"
          :key="video.id"
          :style="{ opacity: Math.max(0.6, video.searchScore) }"
        >
          <mwa-player :video="video" />
          <div class="match-info" v-if="video.searchScore < 1">
            <span class="match-score"
              >연관도: {{ Math.round(video.searchScore * 100) }}%</span
            >
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="result-none">
        <p>검색 결과가 없습니다.</p>
        <div class="search-tips">
          <h3>검색 팁</h3>
          <ul>
            <li>다른 검색어를 시도해보세요</li>
            <li>띄어쓰기로 구분하여 여러 검색어를 입력할 수 있습니다</li>
            <li>유사한 단어도 검색됩니다</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.title {
  padding: 36px 36px 0;
  font-size: 36px;

  .search-stats {
    font-size: 16px;
    color: #666;
    margin-top: 8px;
  }
}

.result {
  padding: 36px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  &-item {
    flex: 0 0 calc(20% - (12px * 4) / 5);
    position: relative;
    transition: opacity 0.2s ease;

    @media (max-width: 1280px) {
      flex: 0 0 calc(50% - (12px * 1) / 2);
    }

    .match-info {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(0, 0, 0, 0.7);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      color: #fff;
    }
  }

  &-none {
    padding: 36px;
    color: #666;

    p {
      font-size: 32px;
      margin-bottom: 24px;
    }

    .search-tips {
      h3 {
        font-size: 18px;
        margin-bottom: 12px;
      }

      ul {
        list-style: disc;
        padding-left: 20px;

        li {
          margin-bottom: 8px;
          line-height: 1.4;
        }
      }
    }
  }
}

.loading,
.error {
  padding: 36px;
  text-align: center;
  color: #666;
  font-size: 24px;
}
</style>
