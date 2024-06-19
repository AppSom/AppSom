'use client'
import convertImgUrl from "@/components/ControlSystem/convertImgUrl";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';

export default function Home() {
  const welcomeText = [
    "Organize your projects, collaborate with your team, and get things done more efficiently. Your productivity journey starts here!",
    "Streamline your workflow, manage tasks effortlessly, and achieve your goals. Let's get started on your next big project!",
    "Plan, organize, and track your tasks with ease. Empower your team and boost your productivity today!",
    "Create boards, add tasks, and collaborate seamlessly. Take control of your projects and stay on top of your workload.",
    "Simplify your project management, stay organized, and achieve more together. Begin your journey towards better productivity now!"
  ];

  const [displayText, setDisplayText] = useState('');
  const [arrayIndex, setArrayIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout:any;

    if (isDeleting) {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setDisplayText(prev => prev.slice(0, -1));
          setCharIndex(charIndex - 1);
        }, 50);
      } else {
        setIsDeleting(false);
        setArrayIndex((arrayIndex + 1) % welcomeText.length);
      }
    } else {
      if (charIndex < welcomeText[arrayIndex].length) {
        timeout = setTimeout(() => {
          setDisplayText(prev => prev + welcomeText[arrayIndex][charIndex]);
          setCharIndex(charIndex + 1);
        }, 100);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, arrayIndex, welcomeText]);

  return (
    <div className="bg-orange-500 w-screen h-screen flex justify-center items-center">
      <div className="bg-white w-[95vw] h-[43vw] rounded-xl flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="text-5xl font-bold font-mono text-gray-700">Welcome To</div>
          <Image loading="lazy" alt="logo" height={2000} width={2000} className="w-1/4 h-auto"
            src={convertImgUrl('https://drive.google.com/file/d/1YZti35uzoUAef3eRcQwM21XfA91bcB6x/view?usp=sharing')} />
          <div className="text-2xl flex font-semibold text-gray-600 font-mono">
            {displayText}
            <span className="blinking-cursor">|</span>
          </div>
          <Link href={'/board'} >
            <button className="w-full px-12 py-6 my-10 text-2xl text-white bg-som rounded-xl hover:bg-orange-700 transition duration-300 ease-in-out font-mono">
              Let's Start
            </button>
          </Link>
        </div>
      </div>
      <style jsx>{`
        .blinking-cursor {
          font-weight: 100;
          font-size: 24px;
          color: black;
          animation: blink 1s step-end infinite;
        }
        
        @keyframes blink {
          from, to {
            color: transparent;
          }
          50% {
            color: black;
          }
        }
      `}</style>
    </div>
  );
}
