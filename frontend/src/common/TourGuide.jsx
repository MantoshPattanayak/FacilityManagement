import React from "react";
import Joyride from "react-joyride";
import tourSteps from "./TourConfig";

const TourGuide = ({ run, callback }) => {
  return (
    <Joyride
      steps={tourSteps}
      run={run}
      continuous
      showSkipButton
      callback={callback}
      styles={{
        options: {
          zIndex: 10000,
        },
      }}
    />
  );
};

export default TourGuide;
