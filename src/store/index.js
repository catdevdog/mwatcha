export const CH_ID_LABEL = [
  {
    value: "ma_mwa",
  },
];

export const compareTimestamps = (timestamp1, timestamp2, hour) => {
  // 타임스탬프를 숫자로 변환
  var date1 = Number(timestamp1);
  var date2 = Number(timestamp2);

  // 두 타임스탬프 간의 차이 (밀리초)
  var timeDiff = Math.abs(date2 - date1);

  // hour 시간과 밀리초 간의 변환
  var xMilliseconds = hour * 60 * 60 * 1000;

  // 주어진 시간 차이보다 큰지 여부를 반환
  return timeDiff >= xMilliseconds;
};

export const getTimeDiffHour = (timestamp) => {
  // 현재 시간을 가져옵니다.
  const now = new Date().getTime();

  // 밀리세컨드 단위의 차이를 계산합니다.
  const difference = now - timestamp;

  // 밀리세컨드를 시간으로 변환합니다.
  const hours = Math.floor(difference / (1000 * 60 * 60));

  return hours;
};

export const covertNum = (number) => {
  if (number >= 100000) {
    const result = Math.floor(number / 10000); // 소수점 이하는 버림
    return `${result}만`;
  } else if (number >= 10000) {
    const result = (number / 10000).toFixed(1); // 소수점 첫째 자리까지 표시
    return result.endsWith(".0") ? `${result.slice(0, -2)}만` : `${result}만`;
  } else if (number >= 1000) {
    const result = (number / 1000).toFixed(1); // 소수점 첫째 자리까지 표시
    return result.endsWith(".0") ? `${result.slice(0, -2)}천` : `${result}천`;
  } else {
    return number.toString();
  }
};

export const timestampToFormat = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear() % 100; // 년도의 마지막 두 자리 가져오기
  const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
  const day = date.getDate();

  // 날짜, 월, 년도를 형식에 맞게 조정하여 반환
  const formattedDate = `${year.toString().padStart(2, "0")}.${month
    .toString()
    .padStart(2, "0")}.${day.toString().padStart(2, "0")}`;
  return formattedDate;
};
