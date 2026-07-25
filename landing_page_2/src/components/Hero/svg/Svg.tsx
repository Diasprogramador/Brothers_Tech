import { forwardRef, useEffect, useRef } from "react";
import { buildClipPath } from "./notchPath";

interface SvgProps {
  pathRef?: React.RefObject<SVGPathElement | null>;
}

export const Svg = forwardRef<SVGSVGElement, SvgProps>(({ pathRef }, _ref) => {
  const innerRef = useRef<SVGPathElement>(null);
  const ref = pathRef ?? innerRef;

  useEffect(() => {
    if (ref && "current" in ref && ref.current) {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      ref.current.setAttribute("d", buildClipPath(0, isMobile));
    }
  }, [ref]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
      width="0"
      height="0"
      style={{ position: "absolute" }}
      aria-hidden="true"
    >
      <defs>
        <clipPath id="formato" clipPathUnits="objectBoundingBox">
          <path
            ref={ref}
            d="M0.809993 0.063112 C0.809993 0.075131 0.816326 0.084875 0.824068 0.084875 H0.985925 C0.993702 0.084875 1 0.094618 1 0.106638 V0.910773 C1 0.922793 0.993702 0.932535 0.985925 0.932535 H0.967628 C0.959887 0.932535 0.953554 0.942328 0.953554 0.955386 V0.978237 C0.953554 0.990257 0.947220 1 0.939479 1 H0.052076 C0.044335 1 0.038001 0.990257 0.038001 0.978237 V0.830250 C0.038001 0.818281 0.031668 0.808488 0.023927 0.808488 H0.014075 C0.006301 0.808488 0 0.798694 0 0.786725 V0.106638 C0 0.094618 0.006301 0.084875 0.014075 0.084875 H0.146376 C0.154116 0.084875 0.160450 0.075131 0.160450 0.063112 V0.021763 C0.160450 0.009742 0.166784 0 0.174525 0 H0.795918 C0.803694 0 0.809993 0.009742 0.809993 0.021763 V0.063112 Z"
          />
        </clipPath>
      </defs>
    </svg>
  );
});

Svg.displayName = "Svg";
