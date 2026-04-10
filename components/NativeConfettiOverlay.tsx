import { useEffect, useRef } from "react";
import { View, useWindowDimensions } from "react-native";
import { PIConfetti, PIConfettiMethods } from "react-native-fast-confetti";

type NativeConfettiOverlayProps = {
  shouldCelebrate: boolean;
};

export default function NativeConfettiOverlay({
  shouldCelebrate,
}: NativeConfettiOverlayProps) {
  const confettiRef = useRef<PIConfettiMethods>(null);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (!shouldCelebrate) {
      return;
    }

    requestAnimationFrame(() => {
      confettiRef.current?.restart();
    });
  }, [shouldCelebrate]);

  return (
    <View className="absolute inset-0 z-50" pointerEvents="none">
      <PIConfetti
        ref={confettiRef}
        count={100}
        width={width}
        height={height}
        blastPosition={{ x: width / 2, y: -20 }}
      />
    </View>
  );
}
