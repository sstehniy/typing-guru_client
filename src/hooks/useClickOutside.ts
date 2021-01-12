import { useEffect } from "react";

export const useClickOutside = (
  ref: React.RefObject<any>,
  cb: () => void,
  avoidRef?: React.RefObject<any>
) => {
  useEffect(() => {
    if (!ref.current) return;

    const handleClickOutside = (e: any) => {
      const target = e ? e.target || e.srcElement : null;
      if (!target) return;

      if (avoidRef && target !== avoidRef.current && !avoidRef.current.contains(target)) {
        if (!ref.current.contains(target)) {
          cb();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, cb, avoidRef]);
};
