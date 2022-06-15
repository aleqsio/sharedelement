import { useIsFocused } from "@react-navigation/native";
import { atom, useAtom } from "jotai";
import { FC, useEffect, useMemo, useState } from "react";
import { Dimensions, ViewStyle } from "react-native";
import Animated, {
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import {
  useReanimatedTransitionProgress,
} from "react-native-screens/reanimated";

let id = 0;
const useIdentifier = () => {
  return useMemo(() => {
    id += 1;
    return id;
  }, []);
};

const useMeasurementRef = () => {
  const aref = useAnimatedRef();
  const [x, setX] = useState(0);
  const refresh = () => {
    setX((x) => x + 1);
  };
  const measurement = useDerivedValue(() => {
    try {
        const measured = measure(aref);
        return [
          measured.x, //0
          measured.y, //1
          measured.width, //2
          measured.height, //3
          measured.pageX, //4
          measured.pageY,
        ];
    } catch (error) {
        return [];
    }
    
  }, [x]);
  return [aref, measurement, refresh] as [
    typeof aref,
    typeof measurement,
    typeof refresh
  ];
};

// export const percentages: Record<string,Readonly<Animated.SharedValue<number>>> = {};

const MeasurementsAtom = atom(
  {} as Record<string, Record<string, Readonly<Animated.SharedValue<number[]>>>>
);
const PercentagesAtom = atom(
  {} as Record<string, Readonly<Animated.SharedValue<number>>>
);

export const refreshByMeasureId = (measureId: string) => {
    console.log(Object.values(refreshes[measureId] || {}));
    Object.values(refreshes[measureId] || {}).forEach((refresh) => refresh());
}

const refreshes: Record<string, Record<string,()=>void>> = {};

export const SharedElement:FC<{style: ViewStyle, sharedId?: string, measureId?: string}> = ({ children, style: parentStyle, sharedId="shared", measureId="shared"  }) => {
  const instanceId = useIdentifier();
  const [measurements, setMeasurements] = useAtom(MeasurementsAtom);
  const [percentages, setPercentages] = useAtom(PercentagesAtom);
  const windowWidth = Dimensions.get("window").width;
  const reaProgress = useReanimatedTransitionProgress();
  const progress = useDerivedValue(() => {
    return reaProgress.closing.value === 0
      ? reaProgress.progress.value
      : 1 - reaProgress.progress.value;
  }, [windowWidth]);
  const [aref, measurement, refresh] = useMeasurementRef();
  useEffect(() => {
    // needed to prevent elements offseting randomly
    // @ts-ignore
    progress.value = 0;

  }, []);
  
  const isFocused = useIsFocused();
  useEffect(() => {
if(!isFocused){
      setMeasurements((p) => {
        delete p[sharedId][instanceId];
        return p;
      });
      setPercentages((p) => {
        delete p[instanceId];
        return p;
      });
      delete refreshes[measureId];
}
  },[isFocused])
  useEffect(() => {
    if (isFocused){
      refreshes[measureId] = { ...refreshes[measureId], [instanceId]: refresh };
    }
    return () => {
      if (refreshes[measureId]?.[instanceId]) {
        delete refreshes[measureId][instanceId];
      }
    };
  })
  
  useEffect(() => {
    setMeasurements((p) => ({ ...p, [sharedId]: {...p[sharedId], [instanceId]: measurement }}));
    setPercentages((p) => ({ ...p, [instanceId]: progress }));
  }, [measurement, progress, instanceId]);

  const offset = useDerivedValue(() => {
    const direction =
      (0.5 - (reaProgress.goingForward.value ^ reaProgress.closing.value)) * 2;
    const width = direction === -1 ? windowWidth : (3 / 10) * windowWidth;
    return (1 - progress.value) * direction * width;
  });

  const sharedOffsetY = useDerivedValue(() => {
    let summaryOffset = 0;
let summaryPercentages = 0;
    Object.entries(measurements[sharedId] || {}).filter(([_,m])=>m.value.length > 0).forEach(([id, measurement]) => {
      summaryOffset +=
        (percentages[id].value || 0) * (measurement.value[5] || 0);
        summaryPercentages += percentages[id].value || 0;

    });
    return (summaryOffset / (summaryPercentages || 1)) - measurement.value[5] || 0;
  }, [measurement, measurements[sharedId], percentages]);
  const sharedOffsetX = useDerivedValue(() => {
    let summaryOffset = 0;
let summaryPercentages = 0;
    Object.entries(measurements[sharedId] || {})
      .filter(([_, m]) => m.value.length > 0)
      .forEach(([id, measurement]) => {
        summaryOffset +=
          (percentages[id].value || 0) * (measurement.value[4] || 0);
                  summaryPercentages += percentages[id].value || 0;

      });
    return (
      summaryOffset / (summaryPercentages || 1) - measurement.value[4] || 0
    );
  }, [measurement, measurements[sharedId], percentages]);

  const sharedOffsetScaleX = useDerivedValue(() => {
    let summaryOffset = 0;
    let summaryPercentages = 0
    Object.entries(measurements[sharedId] || {})
      .filter(([_, m]) => m.value.length > 0)
      .forEach(([id, m]) => {
        summaryOffset += (percentages[id].value || 0) * (m.value[2] || 0);
        summaryPercentages += percentages[id].value || 0;
      });
    return summaryOffset / (summaryPercentages || 1);
  }, [measurement, measurements[sharedId], percentages]);
  const sharedOffsetScaleY = useDerivedValue(() => {
    let summaryOffset = 0;
        let summaryPercentages = 0;

    Object.entries(measurements[sharedId] || {})
      .filter(([_, m]) => m.value.length > 0)
      .forEach(([id, m]) => {
        summaryOffset += (percentages[id].value || 0) * (m.value[3] || 0);
                  summaryPercentages += percentages[id].value || 0;

      });
    return summaryOffset / (summaryPercentages || 1);
  }, [measurement, measurements[sharedId], percentages]);

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: sharedOffsetY.value },
        {
          translateX: sharedOffsetX.value + offset.value,
        },
      ],
    };
  });
  const scaleStyle = useAnimatedStyle(() => {
    return {
      width: sharedOffsetScaleX.value,
      height: sharedOffsetScaleY.value,
    };
  });

  return (
    <Animated.View
      onLayout={() => refresh()}
      ref={aref}
      style={[parentStyle]}
    >
      <Animated.View
        style={[style, scaleStyle]}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
};
