import useScrollToTop from "@/utils/hooks/home/landing/scrollToTop";
import { RxDoubleArrowUp } from "react-icons/rx";

export default function ScrollTopIndicator() {
  const scrollToTop = useScrollToTop();

  return (
    <div
      onClick={scrollToTop}
      className="w-12 h-12 bg-light flex items-center justify-center text-slate-500 text-lg absolute right-0 top-0 cursor-pointer"
    >
      <RxDoubleArrowUp className="animate-bounce" />
    </div>
  );
}
