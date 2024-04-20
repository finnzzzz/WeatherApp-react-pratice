import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';

import WeatherCard from './views/WeatherCard';
import WeatherSetting from './views/WeatherSetting';
import { findLocation } from './utils/helpers';
import { getMoment } from './utils/helpers';

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor}; //從props中解構賦值
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    fill: '#555555',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow: '0 1px 4px 0 rgba(12, 12, 13), 0 0 0 2px rgba(50, 50, 50, 0.2)',
    titleColor: '#f9f9fa',
    fill: '#e2e2e2',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

const authorizationKey = 'CWB-F507AA36-CFE7-4BBE-BAD6-E89B5008FCDB'; //氣象局API授權碼

const fetchCurrentWeather = ({ authorizationKey, locationName }) => {
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`
  )
    .then((response) => response.json())
    .then((data) => {
      const locationDataa = data.records.Station.find((item) => item.StationName === locationName);
      // const weatherElements = locationData.WeatherElement.reduce((neededElements, item) => {
      //   if (['WDSD', 'TEMP'].includes(item.elementName)) {
      //     neededElements[item.elementName] = item.elementValue;
      //   }
      //   return neededElements;
      // });
      return {
        observationTime: locationDataa.ObsTime.DateTime,
        locationName: locationDataa.locationName,
        temperature: locationDataa.WeatherElement.AirTemperature,
        windSpeed: locationDataa.WeatherElement.WindSpeed,
        isLoading: false,
      };
    });
};

const fetchWeatherForecast = ({ authorizationKey, cityName }) => {
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`
  )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce((neededElements, item) => {
        // 「天氣現象」、「降雨機率」、「舒適度」

        if (['PoP', 'CI', 'Wx'].includes(item.elementName)) {
          neededElements[item.elementName] = item.time[0].parameter;
        }
        return neededElements;
      });

      return {
        description: weatherElements.time[0].parameter.parameterName,
        weatherCode: weatherElements.time[0].parameter.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName,
      };
    });
};

function App() {
  const storageCity = localStorage.getItem('cityName') || '基隆市';

  //------------主題顏色------------------
  const [currentTheme, setCurrentTheme] = useState('light');
  const changetheme = (currentTheme) => {
    setCurrentTheme(currentTheme);
  };

  //------------主頁及設定頁------------------
  const [currentPage, setCurrentPage] = useState('WeatherCard');
  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage);
  };

  const [currentCity, setCurrentCity] = useState(storageCity);
  const currentLocation = useMemo(() => findLocation(currentCity), [currentCity]);
  const { cityName, locationName, sunriseCityName } = currentLocation;
  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity);
  };

  const [weatherElement, setWeatherElement] = useState({
    locationName: locationName,
    description: '',
    windSpeed: 0,
    temperature: 0,
    rainPossibility: 0,
    observationTime: new Date(),
    comfortability: '',
    weatherCode: 0,
    isLoading: true,
  });

  const moment = getMoment(cityName);

  const fetchData = useCallback(async () => {
    setWeatherElement((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    const [currentWeather, weatherForecast] = await Promise.all([
      fetchCurrentWeather({ authorizationKey, locationName }),
      fetchWeatherForecast({ authorizationKey, cityName }),
    ]);

    setWeatherElement({
      ...currentWeather,
      ...weatherForecast,
      isLoading: false,
    });
  }, [authorizationKey, cityName, locationName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === 'WeatherCard' && (
          <WeatherCard
            cityName={cityName}
            changetheme={changetheme}
            weatherElement={weatherElement}
            fetchData={fetchData}
            handleCurrentPageChange={handleCurrentPageChange}
            moment={moment}
          />
        )}
        {currentPage === 'WeatherSetting' && (
          <WeatherSetting
            cityName={cityName}
            handleCurrentCityChange={handleCurrentCityChange}
            handleCurrentPageChange={handleCurrentPageChange}
          />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
