import { cn } from "@/lib/utils";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  sizes,
  fill,
  ...rest
}: ImageProps) => {
  const [isLoading, setLoading] = useState(true);
  
  // Ensure sizes is set if fill is true
  const imageSizes = fill && !sizes ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : sizes;
  
  return (
    <Image
      className={cn(
        "transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      blurDataURL={typeof src === "string" ? src : undefined}
      alt={alt ? alt : "Background of a beautiful view"}
      fill={fill}
      sizes={imageSizes}
      {...rest}
    />
  );
};
