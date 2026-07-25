import { useRef } from "react";
import { Svg } from "./svg/Svg";
import { Navbar } from "../Navbar/Navbar";
import "./Hero.css";

export const Hero = () => {
  const pathRef = useRef<SVGPathElement>(null);

  return (
    <>
      <Svg pathRef={pathRef} />

      <section id="home" className="hero">
        <Navbar pathRef={pathRef} />

        <div className="hero-container" />
      </section>
    </>
  );
};
