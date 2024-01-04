import * as tf from "@tensorflow/tfjs";
export const TsTimeArr = (timeArray) => {
  let time = null;
  function createSequences(data, sequenceLength) {
    const sequences = [];

    const targets = [];
    for (let i = 0; i < data.length - sequenceLength; i++) {
      sequences.push(
        data.slice(i, i + sequenceLength - 1).map((item) => [item])
      ); // 시퀀스
      targets.push([data[i + sequenceLength]]); // 타겟 값
    }
    return [sequences, targets];
  }
  const sequenceLength = 10; // 입력 시퀀스 길이
  const [sequences, targets] = createSequences(timeArray, sequenceLength);
  const model = tf.sequential();
  model.add(
    tf.layers.lstm({
      units: 50,
      inputShape: [sequenceLength - 1, 1],
      activation: "relu",
    })
  );
  model.add(tf.layers.dense({ units: 1 }));
  model.compile({
    optimizer: "adam",
    loss: "meanSquaredError",
  });
  const inputTensor = tf.tensor3d(sequences, [
    sequences.length,
    sequenceLength - 1,
    1,
  ]);
  const outputTensor = tf.tensor2d(targets, [targets.length, 1]);
  model.fit(inputTensor, outputTensor, { epochs: 50 }).then(() => {
    const numPredictions = 3; // Number of predictions needed
    const lastSequence = timeArray.slice(-sequenceLength);
    let input = tf.tensor(
      [lastSequence.slice(1).map((item) => [item])],
      [1, sequenceLength - 1, 1]
    );
    const predictions = [];
    for (let i = 0; i < numPredictions; i++) {
      const prediction = model.predict(input);
      const predictedValue = prediction.dataSync()[0];
      predictions.push(predictedValue.toFixed(5));
      // Append the predicted value to the input sequence for the next prediction
      lastSequence.push(predictedValue);
      lastSequence.shift();
      input = tf.tensor(
        [lastSequence.slice(1).map((item) => [item])],
        [1, sequenceLength - 1, 1]
      );
    }
    console.log("Predictions:", predictions);
    time = predictions;
  });
  return time;
};

export const TsDateArr = async (data) => {
  // 유효한 날짜 데이터만 필터링
  const validDates = data.filter((item) => {
    const parts = item.date.split(".");
    return (
      parts.length === 3 && parts.every((part) => !isNaN(parseInt(part, 10)))
    );
  });

  // 날짜 간격 계산
  const dateGaps = validDates
    .map((item, index) => {
      if (index === 0) return null; // 최신 값은 비워둠
      const currentDate = new Date(item.date);
      const prevDate = new Date(validDates[index - 1].date);
      return Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));
    })
    .filter((gap) => gap !== null);

  // TensorFlow.js 모델 생성
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
  model.add(tf.layers.dense({ units: 1 }));

  // 학습 데이터 준비
  const xs = tf.tensor(dateGaps.slice(0, -1));
  const ys = tf.tensor(dateGaps.slice(1));

  // 모델 컴파일
  model.compile({ optimizer: "sgd", loss: "meanSquaredError" });

  // 모델 훈련
  await model.fit(xs, ys, { epochs: 100 });

  // 다음 날짜 간격 예측
  const latestGap = dateGaps[dateGaps.length - 1]; // 최신 간격
  const nextGap = model
    .predict(tf.tensor2d([[latestGap]])) // 최신 간격을 이용하여 예측
    .dataSync()[0];

  // 예측된 간격이 음수인 경우 0으로 변경
  const predictedNextGap = Math.max(0, Math.round(nextGap));

  console.log("Predicted Next Gap:", predictedNextGap);
};
