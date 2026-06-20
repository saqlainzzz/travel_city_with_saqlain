'use client';

import React, { useState, useEffect } from 'react';

export default function ParallaxBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX - window.innerWidth / 2) / 30;
      const y = (clientY - window.innerHeight / 2) / 30;
      setMousePos({ x, y });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY / 8);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="parallax-bg">
      {/* 3D Crescent Moon */}
      <svg
        className="parallax-shape"
        style={{
          top: '12%',
          left: '8%',
          width: '120px',
          height: '120px',
          transform: `translate3d(${mousePos.x * 0.7}px, ${mousePos.y * 0.7 - scrollY * 0.3}px, 0px) rotate(${mousePos.x * 0.4}deg)`,
        }}
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M30 15C30 35 48 51 68 51C75 51 81 49 86 46C80 62 64 74 45 74C23 74 5 56 5 34C5 20 12 7 24 0C22 5 21 10 21 15C21 21 24 30 30 15Z"
          fill="url(#goldGradient)"
          filter="url(#glow)"
        />
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--shape-gradient-1-start, #f59e0b)" />
            <stop offset="100%" stopColor="var(--shape-gradient-1-end, #b45309)" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>

      {/* 8-Pointed Star (Rub el Hizb) */}
      <svg
        className="parallax-shape"
        style={{
          top: '65%',
          left: '80%',
          width: '140px',
          height: '140px',
          transform: `translate3d(${mousePos.x * -0.6}px, ${mousePos.y * -0.6 + scrollY * 0.4}px, 0px) rotate(${mousePos.y * -0.3}deg)`,
        }}
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M50 0 L64 36 L100 50 L64 64 L50 100 L36 64 L0 50 L36 36 Z"
          fill="url(#emeraldGradient)"
        />
        <path
          d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z"
          fill="url(#goldGradient2)"
          opacity="0.8"
        />
        <defs>
          <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--shape-gradient-2-start, #10b981)" />
            <stop offset="100%" stopColor="var(--shape-gradient-2-end, #047857)" />
          </linearGradient>
          <linearGradient id="goldGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--shape-gradient-3-start, #fbbf24)" />
            <stop offset="100%" stopColor="var(--shape-gradient-3-end, #d97706)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating Geometric Hexagon Grid element */}
      <svg
        className="parallax-shape"
        style={{
          top: '30%',
          left: '75%',
          width: '90px',
          height: '90px',
          transform: `translate3d(${mousePos.x * 0.4}px, ${mousePos.y * 0.4 - scrollY * 0.5}px, 0px) rotate(${scrollY * 0.2}deg)`,
        }}
        viewBox="0 0 100 100"
        fill="none"
      >
        <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" stroke="var(--primary)" strokeWidth="3" fill="none" opacity="0.4" />
        <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" stroke="var(--secondary)" strokeWidth="2" fill="none" opacity="0.3" />
      </svg>

      {/* Floating Geometric Octagon Star */}
      <svg
        className="parallax-shape"
        style={{
          top: '75%',
          left: '15%',
          width: '100px',
          height: '100px',
          transform: `translate3d(${mousePos.x * -0.5}px, ${mousePos.y * -0.5 - scrollY * 0.2}px, 0px) rotate(${mousePos.x * -0.5}deg)`,
        }}
        viewBox="0 0 100 100"
        fill="none"
      >
        <rect x="25" y="25" width="50" height="50" stroke="var(--secondary)" strokeWidth="3" transform="rotate(45 50 50)" fill="none" opacity="0.3" />
        <rect x="25" y="25" width="50" height="50" stroke="var(--primary)" strokeWidth="3" fill="none" opacity="0.3" />
      </svg>

      {/* Center Background Light Sphere */}
      <div
        className="parallax-shape"
        style={{
          top: '40%',
          left: '45%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'var(--primary-glow)',
          filter: 'blur(80px)',
          transform: `translate3d(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px, 0px)`,
        }}
      />
    </div>
  );
}
