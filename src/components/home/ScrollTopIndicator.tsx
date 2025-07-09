import useScrollToTop from "@/hooks/ui/useScrollToTop";
import { RxDoubleArrowUp } from "react-icons/rx";

export default function ScrollTopIndicator() {
  const scrollToTop = useScrollToTop();

  return (
    <div
      onClick={scrollToTop}
      className="absolute right-0 top-0 hidden h-12 w-12 cursor-pointer items-center justify-center bg-light text-lg text-slate-500 lg:flex"
    >
      <RxDoubleArrowUp className="animate-bounce" />
    </div>
  );
}
