import { EmojiGrid } from "@/components/EmojiGrid";
import { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PageShellProps = {
  children: ReactNode;
  emoji?: string;
  maxWidthClassName?: string;
  contentClassName?: string;
  scroll?: boolean;
  footer?: ReactNode;
  fullBleed?: ReactNode;
};

export default function PageShell({
  children,
  emoji,
  maxWidthClassName = "max-w-2xl",
  contentClassName = "pt-4 pb-8",
  scroll = true,
  footer,
  fullBleed,
}: PageShellProps) {
  return (
    <SafeAreaView
      className="flex-1 from-indigo-300 to-indigo-200 bg-gradient-to-br"
      edges={["top", "left", "right"]}
    >
      {emoji ? <EmojiGrid emoji={emoji} /> : null}

      {scroll ? (
        <>
          <ScrollView className="flex-1">
            <View className="px-4">
              <View
                className={`w-full ${maxWidthClassName} mx-auto ${contentClassName}`}
              >
                {children}
              </View>
            </View>
            {fullBleed ? <View className="w-full">{fullBleed}</View> : null}
          </ScrollView>
          {footer ? <View className="w-full px-4 pt-2">{footer}</View> : null}
        </>
      ) : (
        <View className="flex-1">
          <View className="px-4">
            <View
              className={`w-full ${maxWidthClassName} mx-auto ${contentClassName}`}
            >
              {children}
            </View>
          </View>
          {fullBleed ? <View className="w-full">{fullBleed}</View> : null}
          {footer ? <View className="w-full pt-2">{footer}</View> : null}
        </View>
      )}
    </SafeAreaView>
  );
}
