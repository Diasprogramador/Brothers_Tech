import { Svg } from "./svg/Svg";
import { Navbar } from "../Navbar/Navbar";
import "./Hero.css";

export const Hero = () => {
  return (
    <>
      {/* Formato Svg: */}
      <Svg />

      <section id="home" className="hero">
        {/* Navbar da página */}
        <Navbar />

        <div className="hero-container" />
      </section>
    </>
  );
};