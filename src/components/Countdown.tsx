import React, {useEffect, useState} from 'react';
import moment, {MomentInput} from 'moment';
import {Text, View} from 'react-native-ui-lib';

interface CountdownProps {
  targetTime: MomentInput;
  message: string;
}

const Countdown: React.FC<CountdownProps> = ({targetTime, message}) => {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const targetMoment = moment(targetTime);
    const timerId = setInterval(() => {
      const currentTime = moment();

      if (currentTime.isBefore(targetMoment)) {
        const duration = moment.duration(targetMoment.diff(currentTime));
        const formattedCountdown = `${duration
          .hours()
          .toString()
          .padStart(2, '0')}:${duration
          .minutes()
          .toString()
          .padStart(2, '0')}:${duration.seconds().toString().padStart(2, '0')}`;
        setCountdown(formattedCountdown);
      } else {
        setCountdown('00:00:00');
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [targetTime]);

  return (
    <View flex center>
      <Text text70L white>
        {message}
      </Text>
      <Text text30L white>
        {countdown}
      </Text>
    </View>
  );
};

export default Countdown;
