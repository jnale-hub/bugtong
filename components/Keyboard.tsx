import KeyButton from "@/components/KeyButton";
import { memo } from "react";
import { View } from "react-native";

type Props = {
  onInput: (c: string) => void;
  onBackspace: () => void;
};

const ROW1 = "qwertyuiop".split("");
const ROW2 = "asdfghjkl".split("");
const ROW3 = "zxcvbnm".split("");
const ROWS = [ROW1, ROW2, ROW3] as const;
const ROW_CLASSES = ["", "px-4", "px-1"] as const;

const Keyboard = ({ onInput, onBackspace }: Props) => {
  return (
    <View className="flex flex-col gap-2 pb-2 px-1">
      {ROWS.map((row, rowIndex) => (
        <View
          key={rowIndex}
          className={`flex-row gap-1 w-full ${ROW_CLASSES[rowIndex]}`}
        >
          {row.map((char) => (
            <KeyButton
              key={char}
              char={char}
              onClickAction={() => onInput(char)}
            />
          ))}
          {rowIndex === 2 ? (
            <KeyButton char="del" onClickAction={onBackspace} />
          ) : null}
        </View>
      ))}
    </View>
  );
};

export default memo(Keyboard);
