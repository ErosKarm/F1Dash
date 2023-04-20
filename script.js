"use strict";
const API_URL_CURRACE = "https://ergast.com/api/f1/current/next.json";
const API_URL_ALLRACE = "https://ergast.com/api/f1/current.json";
const API_URL_FINISHPOSITION =
  "https://ergast.com/api/f1/2023/results.json?limit=1000";
const API_URL_DRIVERSTANDINGS =
  "https://ergast.com/api/f1/2023/driverStandings.json";

let curRaceRound = 0;
let allRaces = [];
let finishPositions = [];
let driverStandings = [];

const getCountryFlag = async (country) => {
  try {
    const response = await fetch("https://flagcdn.com/en/codes.json");
    const data = await response.json();
    let countryCode = Object.keys(data).find((key) => data[key] === country);

    if (countryCode === undefined && country === "USA") countryCode = "us";
    if (countryCode === undefined && country === "UK") countryCode = "gb";
    if (countryCode === undefined && country === "UAE") countryCode = "ae";

    if (countryCode === undefined) {
      return "";
    }

    return `
    <img
    src="https://flagcdn.com/h24/${countryCode}.png"
    srcset="https://flagcdn.com/h48/${countryCode}.png 2x"
    height="24"
    alt="South Africa">
    `;
  } catch (err) {
    console.error(err);
  }
};

const getDates = (date, time) => {
  const correctDate = new Date(`${date}T${time}`);
  const curTime = correctDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const curDate = correctDate
    .toLocaleDateString([], { weekday: "short" })
    .toUpperCase();

  return ` 
  <p class="curDate">${curDate}</p>
  <p class="curTime">${curTime}</p>
  `;
};

const getRaceStatus = () => {
  if (finishPositions[curRaceRound]) {
    return `
    <div class="driverStandings">
    <div class="finished">
    <p>Race status: </p>
    <p style="color: green; font-weight: bold;">FINISHED</p>
    </div>
    <div class="driverStandingsFirst driver-standings-align">
    <p class="position">1</p>
    <p>${finishPositions[curRaceRound]?.Results[0].Driver.permanentNumber} ${finishPositions[curRaceRound]?.Results[0].Driver.code}</p>
    <p>${finishPositions[curRaceRound]?.Results[0].Constructor.name}</p>
    <p>+${finishPositions[curRaceRound]?.Results[0].points} points</p>
    </div>
    </div>
    `;
  } else {
    const raceDate = new Date(
      `${allRaces[curRaceRound].date}T${allRaces[curRaceRound].time}`
    ).getT;

    return `
    <div class="raceStatscontainer">

    <div class="finished">
    <p>Race status: </p>
    <p style="color: red; font-weight: bold;">NOT FINISHED</p>
    </div>

    <div class="driverStandingsFirst driver-standings-align">

    <p class="position">1</p>
    <p>----</p>
    <p>----</p>
    <p>----</p>
    </div>
 
    

  
  </div>
    `;
  }
};

const getCountDown = (object, element) => {
  console.log(document.querySelector(".countDown"));

  // const correctDate = new Date(`${object.date}T${object.time}`).getTime();
  // console.log("it was called");

  // const countDown = setInterval(function () {
  //   const now = new Date().getTime();

  //   const distance = correctDate - now;

  //   const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  //   const hours = Math.floor(
  //     (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  //   );
  //   const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  //   const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  //   console.log(document.getElementById("countDown"));

  //   document.getElementById("countDown").innerHTML =
  //     days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
  // }, 1000);
};

const displayData = async (object) => {
  let countrycode = getCountryFlag(object.Circuit.Location.country);
  let raceStatus = getRaceStatus();

  const html = `
       <div class="header">
         <img class="icon" id="previous" src="previous.svg" alt="previous" />
        ${object.raceName} ${await countrycode}
        <img class="icon" id="next" src="next.svg" alt="next" />
      </div>
      <div class="round">
      <p>${object.Circuit.circuitName}</p>
      <p>Race nr: ${object.round}</p>
      <p>${new Date(`${object.date}T${object.time}`).toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })}</p>
    </div> 
    <div class="race-information">
      <div class="race-stats">
      ${raceStatus}
      <div class="driverStandings">
      <p>Driver Standings:</p>
      <div class="driverStandingsFirst driver-standings-align">
      <p class="position">1</p>
      <p>${driverStandings[0].Driver.permanentNumber} ${
    driverStandings[0].Driver.code
  }</p>
      <p>${driverStandings[0].Constructors[0].name}</p>
      <p>${driverStandings[0].points} points</p>
      </div>
      <div class="driverStandingsFirst driver-standings-align">
      <p class="position">1</p>
      <p>${driverStandings[1].Driver.permanentNumber} ${
    driverStandings[1].Driver.code
  }</p>
      <p>${driverStandings[1].Constructors[0].name}</p>
      <p>${driverStandings[1].points} points</p>
      </div>
      <div class="driverStandingsFirst driver-standings-align">
      <p class="position">1</p>
      <p>${driverStandings[2].Driver.permanentNumber} ${
    driverStandings[2].Driver.code
  }</p>
      <p>${driverStandings[2].Constructors[0].name}</p>
      <p>${driverStandings[2].points} points</p>
      </div>


      </div>

      </div>
    
      
      


      <div class="race-times"> 
      <p class="race-time">Race times:</p>

      <div class="align-center race">
        <div class="eventName"><p>RACE:</p></div>
        <div class="eventTime"><p>${getDates(
          object.date,
          object.time
        )}</p></div>
      </div>
      <div class="qualy align-center">
        <div class="eventName"><p>${
          Object.keys(object).includes("Sprint") ? "SPRINT:" : "QUALIFYING:"
        }</p></div>
        <div class="eventTime"><p>${
          Object.keys(object).includes("Sprint")
            ? getDates(object.Sprint.date, object.Sprint.time)
            : getDates(object.Qualifying.date, object.Qualifying.time)
        }</p></div>
      </div>
      <div class="practice3 align-center">
        <div class="eventName"><p>${
          Object.keys(object).includes("Sprint") ? "PRACTICE 2:" : "PRACTICE 3:"
        }</p></div>
        <div class="eventTime"><p>${
          Object.keys(object).includes("Sprint")
            ? getDates(object.SecondPractice.date, object.SecondPractice.time)
            : getDates(object.Qualifying.date, object.Qualifying.time)
        }</p></div>
      </div>
      <div class="practice2 align-center">
        <div class="eventName"><p>${
          Object.keys(object).includes("Sprint") ? "QUALIFYING:" : "PRACTICE 2:"
        }</p></div>
        <div class="eventTime"><p>${
          Object.keys(object).includes("Sprint")
            ? getDates(object.Qualifying.date, object.Qualifying.time)
            : getDates(object.SecondPractice.date, object.SecondPractice.time)
        }</p></div>
      </div>
      <div class="practive1 align-center">
        <div class="eventName"><p>PRACTICE 1:</p></div>
        <div class="eventTime"><p>${getDates(
          object.FirstPractice.date,
          object.FirstPractice.time
        )}</p></div>
        </div>
      </div>
      </div>
      </div>
   
    `;
  // document.querySelector(".loader").classList.add("display-none");
  document.querySelector(".container").innerHTML = "";
  document.querySelector(".container").insertAdjacentHTML("afterbegin", html);

  // Add a countdown

  document.getElementById("previous").addEventListener("click", () => {
    if (curRaceRound === 0) return;
    getCountDown();
    curRaceRound = curRaceRound - 1;
    displayData(allRaces[curRaceRound]);
  });

  document.getElementById("next").addEventListener("click", () => {
    if (curRaceRound === allRaces.length - 1) return;
    getCountDown();
    curRaceRound = curRaceRound + 1;
    displayData(allRaces[curRaceRound]);
  });
};

const fetchData = async (API_URL, round = 0) => {
  try {
    // 1) Fetch data to get all the races
    const responseAllRaces = await fetch(API_URL_ALLRACE);
    const allracesData = await responseAllRaces.json();
    allRaces = allracesData.MRData.RaceTable.Races;
    // 1.5) Fetch data to get finish results
    const responseFinishPositions = await fetch(API_URL_FINISHPOSITION);
    const dataFinishPositions = await responseFinishPositions.json();
    finishPositions = dataFinishPositions.MRData.RaceTable.Races;
    // 1.75 Fetch data to get driver standigns
    const responseDriverStandings = await fetch(API_URL_DRIVERSTANDINGS);
    const dataDriverStandings = await responseDriverStandings.json();
    driverStandings =
      dataDriverStandings.MRData.StandingsTable.StandingsLists[0]
        .DriverStandings;

    // 2) Fetch data to get current race index
    const response = await fetch(API_URL);
    const data = await response.json();
    curRaceRound = parseInt(data.MRData.RaceTable.round - 1);

    displayData(allRaces[curRaceRound]);
  } catch (err) {
    console.error(err);
  }
};

fetchData(API_URL_CURRACE);
