import React, { useState } from "react";
import styled from "@emotion/styled";
import dayjs from "dayjs";

import WeatherIcon from "./../components/WeatherIcon.js";
import { ReactComponent as AirFlowIcon } from "./../images/airFlow.svg";
import { ReactComponent as RainIcon } from "./../images/rain.svg";
import { ReactComponent as RefreshIcon } from "./../images/refresh.svg";
import { ReactComponent as LoadingIcon } from "./../images/loading.svg";
import { ReactComponent as MoonIcon } from "./../images/moon.svg";
import { ReactComponent as SunIcon } from "./../images/sun.svg";
import { ReactComponent as CogIcon } from "./../images/cog.svg";

const WeatherCardWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`;

const Toggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  svg {
    fill: ${({ theme }) => theme.fill};
    width: 24px;
    height: 24px;
    border-radius: 10px;
    border: 1px solid #d8d8d8;
    padding: 2px;
    margin-right: 12px;
    cursor: pointer;
  }
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;
  svg {
    width: 25px;
    height: auto;
    margin-right: 15px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  svg {
    width: 25px;
    height: auto;
    margin-right: 15px;
  }
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};
  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    animation: rotate infinite 1.5s linear;
    animation-duration: ${({ isLoading }) => (isLoading ? "1.5s" : "0s")};
  }
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;

const Cog = styled(CogIcon)`
  position: absolute;
  top: 80px;
  right: 30px;
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const WeatherCard = ({
  weatherElement,
  fetchData,
  changetheme,
  handleCurrentPageChange,
  cityName,
  moment,
}) => {
  const {
    observationTime,
    locationName,
    temperature,
    windSpeed,
    description,
    weatherCode,
    rainPossibility,
    comfortability,
    isLoading,
  } = weatherElement;

  const changeTheme = () => {
    changetheme("dark");
  };

  const changeTheme2 = () => {
    changetheme("light");
  };

  return (
    <WeatherCardWrapper>
      <Cog
        onClick={() => {
          handleCurrentPageChange("WeatherSetting");
        }}
      />
      <Location>
        {cityName}
        <Toggle>
          <SunIcon onClick={changeTheme2} />
          <MoonIcon onClick={changeTheme} />
        </Toggle>
      </Location>
      <Description>
        {description} {"-"} {comfortability}
      </Description>
      <CurrentWeather>
        <Temperature>
          {Math.round(temperature)} <Celsius>°C</Celsius>
        </Temperature>
        <WeatherIcon weatherCode={weatherCode} moment={moment} />
      </CurrentWeather>
      <AirFlow>
        <AirFlowIcon />風速 {windSpeed} m/h
      </AirFlow>
      <Rain>
        <RainIcon /> 降雨機率 {rainPossibility}%
      </Rain>
      <Refresh onClick={fetchData} isLoading={isLoading}>
        最後觀測時間：
        {new Intl.DateTimeFormat("zh-TW", {
          hour: "numeric",
          minute: "numeric",
        }).format(dayjs(observationTime))}
        {isLoading ? <LoadingIcon /> : <RefreshIcon />}
      </Refresh>
    </WeatherCardWrapper>
  );
};

export default WeatherCard;
