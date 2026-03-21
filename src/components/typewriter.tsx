"use client";
import { useState, useEffect } from "react";

const words = ["Agents", "Skills", "Tools"];
const TYPING_SPEED = 100;
const DELETING_SPEED = 60;
const PAUSE_AFTER_TYPE = 2000;
const PAUSE_AFTER_DELETE = 300;

export function Typewriter() {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        setText(currentWord.substring(0, text.length + 1));
        if (text.length + 1 === currentWord.length) {
          // Finished typing, pause then delete
          setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPE);
        }
      } else {
        // Deleting
        setText(currentWord.substring(0, text.length - 1));
        if (text.length - 1 === 0) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? DELETING_SPEED : (text.length === 0 ? PAUSE_AFTER_DELETE : TYPING_SPEED));

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex]);

  return (
    <span className="text-on-surface-variant">
      {text}
      <span className="animate-[blink_1s_step-end_infinite] text-charcoal">|</span>
    </span>
  );
}
