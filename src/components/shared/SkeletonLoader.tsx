import { Skeleton } from "@nextui-org/react";
import { ReactNode } from "react";

export default function SkeletonLoader({
  children,
  customStyles,
}: {
  children: ReactNode;
  customStyles: string;
  isLoading: boolean;
}) {
  return <Skeleton className={`${customStyles}`}>{children}</Skeleton>;
}
