import { emojiAvatarForAddress } from "@/utils/helpers/walletButtonStyleGenerator";
import { AvatarComponent } from "@rainbow-me/rainbowkit";
import { useMemo } from "react";
import { BlurImage } from "./blur-image";

export const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  const { color: backgroundColor, emoji } = useMemo(
    () => emojiAvatarForAddress(address ?? ""),
    [address]
  );

  return (
    <div
      style={{
        backgroundColor: backgroundColor,
        height: size,
        width: size,
      }}
      className="flex items-center justify-center rounded-full"
    >
      {emoji}
    </div>
  );
};
