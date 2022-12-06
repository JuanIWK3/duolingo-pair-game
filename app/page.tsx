"use client";

import styles from "@/app/page.module.scss";
import { pairs } from "@/data/pairs";
import { MouseEvent, useEffect, useState } from "react";

export default function Home() {
  const gameTime = 30;
  const [points, setPoints] = useState(0);
  const [fails, setFails] = useState(0);
  const shuffledPairs = pairs.sort(() => Math.random() - 0.5).slice(0, 5);
  const [leftVisiblePairs, setLeftVisiblePairs] = useState<string[][]>([]);
  const [rightVisiblePairs, setRightVisiblePairs] = useState<string[][]>([]);
  const [selected, setSelected] = useState<{
    word: string;
    side: "left" | "right";
  } | null>(null);
  const [timer, setTimer] = useState(0);

  const changeVisiblePairs = () => {
    const sortedPairs = shuffledPairs;
    return sortedPairs;
  };

  const isSelected = (word: string, side: "left" | "right") => {
    if (!selected) return false;

    if (selected.word === word) {
      return true;
    }

    return false;
  };

  const handleClick = (word: string, side: "left" | "right") => {
    if (!selected) {
      setSelected({ word, side });
      return;
    }

    if (selected.word === word) {
      console.log("already selected");
      setSelected(null);
      return;
    }

    if (selected.side === side) {
      setSelected({ word, side });
      return;
    }

    const index = pairs.findIndex(
      (pair) => pair[side === "left" ? 1 : 0] === selected.word
    );

    const correct = pairs[index][selected.side === "left" ? 1 : 0];

    if (index === -1) {
      console.log("wtf?");
      return;
    }

    if (word === correct) {
      let randomPair: string[] | null = null;

      const getRandomPair = () => {
        const randomIndex = Math.floor(Math.random() * pairs.length);
        let tempRandomPair = pairs[randomIndex];

        console.log(tempRandomPair);

        if (tempRandomPair == null) return;

        const indexLeft = leftVisiblePairs.findIndex(
          (p) => p[0] === tempRandomPair[0] && p[1] === tempRandomPair[1]
        );

        const indexRight = rightVisiblePairs.findIndex(
          (p) => p[0] === tempRandomPair[0] && p[1] === tempRandomPair[1]
        );

        if (indexLeft === -1 && indexRight === -1) {
          randomPair = tempRandomPair;
        }
      };

      while (!randomPair) getRandomPair();

      let newLeftPairs = [...leftVisiblePairs];
      newLeftPairs[
        newLeftPairs.findIndex(
          (pair) => pair[side === "left" ? 1 : 0] === selected.word
        )
      ] = randomPair;

      let newRightPairs = [...rightVisiblePairs];
      newRightPairs[
        newRightPairs.findIndex(
          (pair) => pair[side === "left" ? 1 : 0] === selected.word
        )
      ] = randomPair;

      console.log(randomPair);

      setLeftVisiblePairs(newLeftPairs);
      setRightVisiblePairs(newRightPairs);
      setPoints((prev) => prev + 1);
    } else {
      setFails((prev) => prev + 1);
      console.log("incorrect");
    }

    setSelected(null);
  };

  useEffect(() => {
    setLeftVisiblePairs(changeVisiblePairs());
    setRightVisiblePairs(shuffledPairs);
  }, []);

  useEffect(() => {
    timer > 0 && setTimeout(() => setTimer(timer - 1), 2000);
  }, [timer]);

  return (
    <div className={styles.container}>
      <div></div>
      <main className={styles.main}>
        <div>
          <p>{timer} seconds left</p>
          <p>corrects: {points}</p>
          <p>wrongs: {fails}</p>
        </div>
        {timer > 0 ? (
          <div className={styles.game}>
            <div className={styles.left}>
              {leftVisiblePairs
                .sort(() => Math.random() - 0.5)
                .map((p, i) => {
                  if (!p) {
                    return <div>Loading</div>;
                  } else {
                    return (
                      <div
                        key={i}
                        className={`${styles.pair} ${
                          isSelected(p[0], "left") && styles.selected
                        }`}
                        onClick={() => handleClick(p[0], "left")}
                      >
                        {p[0]}
                      </div>
                    );
                  }
                })}
            </div>
            <div className={styles.right}>
              {rightVisiblePairs
                .sort(() => Math.random() - 0.3)
                .map((p, i) => {
                  if (!p) {
                    return <div>Loading</div>;
                  } else {
                    return (
                      <div
                        key={i}
                        className={`${styles.pair} ${
                          isSelected(p[1], "right") && styles.selected
                        }`}
                        onClick={() => handleClick(p[1], "right")}
                      >
                        {p[1]}
                      </div>
                    );
                  }
                })}
            </div>
          </div>
        ) : (
          <button onClick={() => setTimer(gameTime)}>Start</button>
        )}
        {timer > 0 && <button onClick={() => setTimer(30)}>Restart</button>}
      </main>
    </div>
  );
}
