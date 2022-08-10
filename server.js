const express = require("express");
const axios = require("axios");
const PORT = 5000;

const app = express();

app.get("/", async (req, res) => {
  try {
    const url =
      "https://api.brightsky.dev/weather?lat=51.58&lon=7.38&date=2021-04-21&last_date=2021-08-21";
    const { data } = await axios.get(url);
    const filterData = data.weather.filter((whether) => {
      return (
        whether.precipitation === 0 &&
        whether.sunshine > 0 &&
        whether.temperature > 20 &&
        whether.temperature < 30 &&
        whether.wind_speed < 30
      );
    });
    let storeData = [];
    for (let i = 0; i < filterData.length - 1; i++) {
      for (let j = 0; j < data.sources.length; j++) {
        if (filterData[i].source_id === data.sources[j].id) {
          // result
          storeData.push({
            date: filterData[i].timestamp.split("T")[0],
            place: data.sources[j].station_name,
          });
        }
      }
    }

    const main = (arr) => {
      let newArray = [];
      for (let i = 1; i < arr.length; i++) {
        if (arr[i].date !== arr[i - 1].date) {
          newArray.push(arr[i]);
        }
      }

      if (arr[0]?.date === arr[1]?.date) {
        newArray.unshift(arr[0]);
      }
      return newArray;
    };
    const result = main(storeData);

    if (Object.values(result)[0] == undefined) {
      res
        .status(200)
        .send({ message: "Sorry but you can't plan the party for these days" });
    }

    res.status(200).send({ message: result });
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
