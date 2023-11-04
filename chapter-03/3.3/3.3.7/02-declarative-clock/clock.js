// // デジタル時計（関数型プログラミング的アプローチ）
// const oneSecond = () => 1000
// const getCurrentTime = () => new Date()
// const clear = () => console.clear()
// const log = message => console.log(message)

// const abstractClockTime = date =>
//     ({
//         hours: date.getHours(),
//         minutes: date.getMinutes(),
//         seconds: date.getSeconds()
//     })

// const civilianHours = clockTime =>
//     ({
//         ...clockTime,
//         hours: (clockTime.hours > 12) ?
//         clockTime.hours - 12 :
//             clockTime.hours
//     })

// const appendAMPM = clockTime =>
//     ({
//         ...clockTime,
//         ampm: (clockTime.hours >= 12) ? "PM" : "AM"
//     })

// const display = target => time => target(time)

// const formatClock = format =>
//     time =>
//         format.replace("hh", time.hours)
//             .replace("mm", time.minutes)
//             .replace("ss", time.seconds)
//             .replace("tt", time.ampm)

// const prependZero = key => clockTime =>
//     ({
//         ...clockTime,
//         [key]: (clockTime[key] < 10) ?
//         "0" + clockTime[key] :
//             clockTime[key]
//     })

// const compose = (...fns) =>
//     (arg) =>
//         fns.reduce(
//             (composed, f) => f(composed),
//             arg
//         )

// const convertToCivilianTime = clockTime =>
//     compose(
//         appendAMPM,
//         civilianHours
//     )(clockTime)

// const doubleDigits = civilianTime =>
//     compose(
//         prependZero("hours"),
//         prependZero("minutes"),
//         prependZero("seconds")
//     )(civilianTime)

// const startTicking = () =>
//     setInterval(
//         compose(
//             clear,
//             getCurrentTime,
//             abstractClockTime,
//             convertToCivilianTime,
//             doubleDigits,
//             formatClock("hh:mm:ss tt"),
//             display(log)
//         ),
//         oneSecond()
//     )

// startTicking()

// 自分で実装
// I/Oの関数
const oneSecond = () => 1000; // これだけでも関数化するのが関数型PG
const getCurrentTime = () => new Date();
const clear = () => console.clear();
const log = (message) => console.log(message);

// データ変換関数(非破壊的)
const serializeClockTime = (date) => ({
  hours: date.getHours(),
  minutes: date.getMinutes(),
  seconds: date.getSeconds(),
});

const civilianHours = (clockTime) => ({
  ...clockTime,
  hours: clockTime.hours > 12 ? clockTime.hours - 12 : clockTime.hours,
});

const appendAMPM = (clockTime) => ({
  ...clockTime,
  ampm: clockTime.hours >= 12 ? 'PM' : 'AM',
});

// 高階関数(L1)
const display = (target) => (time) => target(time);
const formatClock = (format) => (time) =>
  format
    .replace('hh', time.hours)
    .replace('mm', time.minutes)
    .replace('ss', time.seconds)
    .replace('tt', time.ampm);
const prependZero = (key) => (clockTime) => ({
  ...clockTime,
  [key]: clockTime[key] < 10 ? '0' + clockTime[key] : clockTime[key],
});

// 高階関数(L2)
const compose =
  (...fns) =>
  (arg) =>
    fns.reduce((composed, f) => f(composed), arg);

// appendAMPM(clockTime)してcivilianHours(clockTIme)する関数
const convertToCivilianTime = (clockTime) =>
  compose(appendAMPM, civilianHours)(clockTime);

const doubleDigits = (civilianTime) =>
  compose(
    prependZero('hours'),
    prependZero('minutes'),
    prependZero('secounds')
  )(civilianTime);

// 最終的な関数
const startTicking = () => {
  setInterval(
    compose(
      clear,
      getCurrentTime,
      serializeClockTime,
      convertToCivilianTime,
      doubleDigits,
      formatClock('hh:mm:ss:tt'),
      display(log)
    ),
    oneSecond()
  );
};

startTicking();
