import { useCallback } from "react";

const useScrollToTop = () => {
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // You can change this to "auto" if you don't want smooth scrolling
    });
  }, []);

  return scrollToTop;
};

export default useScrollToTop;
