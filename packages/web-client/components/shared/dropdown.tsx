"use client";

import { useCallback, useEffect, useRef } from "react";
import { DropdownProps } from "@/utils/types/shared.types";

const Dropdown: React.FC<DropdownProps> = ({
  children,
  trigger,
  options,
  contentClassName = "",
  dropdownClassname = "",
  open,
  persist,
  setOpen,
}) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleOutsideClick: EventListener = useCallback((event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (trigger === "click") {
      document.addEventListener("click", handleOutsideClick);

      return () => {
        document.removeEventListener("click", handleOutsideClick);
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <div
      ref={dropdownRef}
      className={`relative ${contentClassName}`}
      onMouseEnter={() => trigger === "hover" && setOpen(true)}
      onMouseLeave={() => trigger === "hover" && setOpen(false)}
      onClick={() => setOpen(!open)}
    >
      {children}

      <div
        className={`${
          open ? "h-fit max-h-screen" : "max-h-0"
        } absolute top-full z-30 overflow-hidden transition-all transform-gpu ease-in duration-500 ${dropdownClassname}`}
        onClick={(e) => {
          persist && e.stopPropagation();
        }}
      >
        {options?.map((option) => option)}
      </div>
    </div>
  );
};

export default Dropdown;
