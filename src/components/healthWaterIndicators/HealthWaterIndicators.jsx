import React, { useState } from "react";

import style from "./HealthWaterIndicators.module.scss";

import health from "../../assets/health.svg";
import water from "../../assets/water.svg";

const HealthWaterIndicators = () => {
  const [healthPercentage, setHealthPercentage] = useState(40);
  const [waterPercentage, setWaterPercentage] = useState(38);
  return (
    <div className={style.indicators}>
      <div className={style.healthIndicator}>
        <div className={style.healthIcon}>
          <img src={health} alt="health" />
        </div>
        <div className={style.healthIndicatorRange}>
          <div className={style.healthIndicatorBg}>
            <div
              className={style.healthIndicatorFill}
              style={{ width: `${healthPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className={style.waterIndicator}>
        <div className={style.waterIcon}>
          <img src={water} alt="water" />
        </div>
        <div className={style.waterIndicatorRange}>
          <div className={style.waterIndicatorBg}>
            <div
              className={style.waterIndicatorFill}
              style={{ width: `${waterPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthWaterIndicators;
