"use client";

import Image from "next/image";
import styles from "./page.module.css";
import MasonryGallery from "../components/MasonryGallery";
import Masonry from "../components/MasonryGallery";
import SplitText from "@/components/SplitText/SplitText";
import "@/components/SplitText/SplitText.css";
import { useState } from "react";

export default function Home() {
  const [view, setView] = useState("all"); // 'all', 'text', 'images'

  const items = [
    {
      id: "1",
      img: "/images/image-1.jpg",
      url: "#",
      height: 400,
    },
    {
      id: "2",
      img: "/images/image-2.jpg",
      url: "#",
      height: 250,
    },
    {
      id: "3",
      img: "/images/image-3.jpg",
      url: "#",
      height: 600,
    },
    {
      id: "4",
      img: "/images/image-4.jpg",
      url: "#",
      height: 350,
    },
    {
      id: "5",
      img: "/images/image-5.jpg",
      url: "#",
      height: 500,
    },
    {
      id: "6",
      img: "/images/image.jpg",
      url: "#",
      height: 300,
    },
    {
      id: "7",
      img: "/images/image-7.jpg",
      url: "#",
      height: 450,
    },
    {
      id: "8",
      img: "/images/image-8.jpg",
      url: "#",
      height: 400,
      main: true,
    },
    {
      id: "9",
      img: "/images/image-9.jpg",
      url: "#",
      height: 300,
    },
    {
      id: "10",
      img: "/images/image-10.jpg",
      url: "#",
      height: 350,
    },
    {
      id: "11",
      img: "/images/image-11.jpg",
      url: "#",
      height: 400,
    },
    {
      id: "12",
      img: "/images/image-12.jpg",
      url: "#",
      height: 300,
    },      
    {
      id: "13",
      img: "/images/image-13.jpg",
      url: "#",
      height: 500,
    },      
    {
      id: "14",
      img: "/images/image-14.jpg",
      url: "#",
      height: 350,
    },      
    {
      id: "15",
      img: "/images/image-15.jpg",
      url: "#",
      height: 400,
    },      
    {
      id: "16",
      img: "/images/image-16.jpg",
      url: "#",
      height: 300,
    },      
    {
      id: "17",
      img: "/images/image-17.jpg",
      url: "#",
      height: 450,
    },      
    {
      id: "18",
      img: "/images/image-18.jpg",
      url: "#",
      height: 400,
    },      
    {
      id: "19",
      img: "/images/image-19.jpg",
      url: "#",
      height: 300,
    },

    {
      id: "20",
      img: "/images/image-20.jpg",
      url: "#",
      height: 500,
    },
    {
      id: "21",
      img: "/images/image-21.jpg",
      url: "#",
      height: 350,
    },      
    {
      id: "22",
      img: "/images/image-22.jpg",
      url: "#",
      height: 400,
    },      
    {
      id: "23",
      img: "/images/image-23.jpg",
      url: "#",
      height: 300,
    },      
    {
      id: "24",
      img: "/images/image-24.jpg",
      url: "#",
      height: 450,
    },      
    {
      id: "25",
      img: "/images/image-25.jpg",
      url: "#",
      height: 400,
    },      
    {
      id: "26",
      img: "/images/image-26.jpg",
      url: "#",
      height: 300,
    },  
    {
      id: "27",
      img: "/images/image-27.jpg",
      url: "#",
      height: 500,
    },  
    {
      id: "28",
      img: "/images/image-28.jpg",
      url: "#",
      height: 350,
    },  
    {
      id: "29",
      img: "/images/image-29.jpg",
      url: "#",
      height: 400,
    },  
    {
      id: "30",
      img: "/images/image-30.jpg",
      url: "#",
      height: 300,
    },



  ];

  return (
    <div className={styles.page}>
      <div style={{ display: "flex", gap: 1, margin: '30px 0 5px' }}>
        <button
          className={`${styles.btn} ${view === "all" ? styles.activeBtn : ""}`}
          onClick={() => setView("all")}
        >
          Ver todo
        </button>
        <button
          className={`${styles.btn} ${view === "text" ? styles.activeBtn : ""}`}
          onClick={() => setView("text")}
        >
          Solo texto
        </button>
        <button
          className={`${styles.btn} ${view === "images" ? styles.activeBtn : ""}`}
          onClick={() => setView("images")}
        >
          Solo imágenes
        </button>
      </div>
      {(view === "all" || view === "text") && (
        <header className={styles.header}>
          <SplitText
            text="¡Gracias Facu!"
            className={styles.title}
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            tag="h1"
          />
          <SplitText
            text="Tu equipo siempre estará agradecido por tu dedicación y pasión en Onboarding."
            className={styles.subtitle}
            delay={30}
            duration={0.7}
            ease="power3.out"
            splitType="words"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            tag="h2"
          />
          <p className={styles.message}>
            ¡Te queremos mucho! Éxitos en todo lo nuevo que emprendas. <br />
            <span className={styles.heart}>♥</span>
          </p>
          <div className={styles.participants}>
            <span>De parte de:</span>
            <ul>
              <li>Kelly</li>
              <li>Ceci</li>
              <li>Mati</li>
              <li>Ani</li>
              <li>Nico</li>
            </ul>
          </div>
        </header>
      )}
      {(view === "all" || view === "images") && (
        <Masonry
          items={items}
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover={true}
          hoverScale={0.95}
          blurToFocus={true}
          colorShiftOnHover={false}
        />
      )}
    </div>
  );
}
