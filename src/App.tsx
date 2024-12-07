/* eslint-disable no-loop-func */
/* eslint-disable no-new-func */
import React, { useState, useEffect, useRef } from "react";
import { useStyles } from "./AppUseStyle"; 
import {validateEquation, evaluateEquation} from  "./utils";
import FunctionCard from "./functionCard";

// Type definition for a function card
interface FunctionCardType {
  id: number;
  equation: string;
  nextFunction: number | null;
}
interface LineCoordinate {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
const App: React.FC = () => {
  const classes = useStyles();
  const checkboxRefs: any = useRef([]);

  const [initialValue, setInitialValue] = useState<number>(2);
  const [functions, setFunctions] = useState<FunctionCardType[]>([
    { id: 1, equation: "x^2", nextFunction: 2 },
    { id: 2, equation: "2x+4", nextFunction: 4 },
    { id: 3, equation: "x^2+20", nextFunction: null },
    { id: 4, equation: "x-2", nextFunction: 5 },
    { id: 5, equation: "x/2", nextFunction: 3 },
  ]);
  const [result, setResult] = useState<number>(0);
  const [lineCoordinates, setLineCoordinates] = useState<LineCoordinate[]>([]);

  useEffect(() => {
    const updateCoordinates = () => {
      const coordinates: any = [];
      const initialCheckbox =
        checkboxRefs.current["initial"]?.[1]?.getBoundingClientRect();
      const resultCheckbox =
        checkboxRefs.current["result"]?.[0]?.getBoundingClientRect();
      if (initialCheckbox && checkboxRefs.current[1]?.[0]) {
        const firstCardCheckbox =
          checkboxRefs.current[1][0].getBoundingClientRect();
        coordinates.push({
          x1: initialCheckbox.left + initialCheckbox.width / 2,
          y1: initialCheckbox.top + initialCheckbox.height / 2,
          x2: firstCardCheckbox.left + firstCardCheckbox.width / 2,
          y2: firstCardCheckbox.top + firstCardCheckbox.height / 2,
        });
      }
      for (let j = 0; j < functions.length; j++) {
        const current = functions[j].id;
        const next: any = functions[j].nextFunction;
        const secondCheckbox =
          checkboxRefs.current[current]?.[1]?.getBoundingClientRect();
        const firstCheckboxNext =
          checkboxRefs.current[next]?.[0]?.getBoundingClientRect();
        if (secondCheckbox && firstCheckboxNext) {
          coordinates.push({
            x1: secondCheckbox.left + secondCheckbox.width / 2,
            y1: secondCheckbox.top + secondCheckbox.height / 2,
            x2: firstCheckboxNext.left + firstCheckboxNext.width / 2,
            y2: firstCheckboxNext.top + firstCheckboxNext.height / 2,
          });
        }
        if (!firstCheckboxNext && resultCheckbox) {
          coordinates.push({
            x1: secondCheckbox.left + secondCheckbox.width / 2,
            y1: secondCheckbox.top + secondCheckbox.height / 2,
            x2: resultCheckbox.left + resultCheckbox.width / 2,
            y2: resultCheckbox.top + resultCheckbox.height / 2,
          });
        }
      }
      setLineCoordinates(coordinates);
    };

    updateCoordinates();
    window.addEventListener("resize", updateCoordinates);
    return () => window.removeEventListener("resize", updateCoordinates);
  }, [functions]);
  useEffect(() => {
    let currentValue = initialValue;
    let currentFunction = functions.find((func) => func.id === 1);

    while (currentFunction) {
      const newValue = evaluateEquation(currentFunction.equation, currentValue);
      if (isNaN(newValue)) {
        setResult(NaN);
        return;
      }
      currentValue = newValue;
      currentFunction = functions.find(
        (func) => func.id === currentFunction?.nextFunction
      );
    }

    setResult(currentValue);
  }, [initialValue, functions]);

  const updateEquation = (id: number, equation: string) => {
    if (!validateEquation(equation)) {
      alert(
        "Invalid equation! Use only x, numbers, and basic operators (^, +, -, *, /)."
      );
      return;
    }
    setFunctions((prev) =>
      prev.map((func) => (func.id === id ? { ...func, equation } : func))
    );
  };

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <div className={classes.initialValueContainer}>
          <div className={classes.initialValueBox}>
            <input
              type="number"
              className={classes.input1}
              value={initialValue}
              onChange={(e) => setInitialValue(Number(e.target.value))}
            />
            <input
              type="radio"
              checked
              ref={(el) => {
                if (!checkboxRefs.current["initial"]) {
                  checkboxRefs.current["initial"] = [];
                }
                checkboxRefs.current["initial"][1] = el;
              }}
            />
          </div>
          <label className={classes.label}>Initial value of x </label>
        </div>
        <div className={classes.cardRow}>
          {functions.slice(0, 3).map((func) => (
            <FunctionCard
              key={func.id}
              func={func}
              updateEquation={updateEquation}
              functions={functions}
              checkboxRefs={checkboxRefs}
              classes={classes}
            />
          ))}
        </div>
        <div className={classes.resultValueContainer}>
          <div className={classes.resultValueBox}>
            <input
              type="radio"
              ref={(el) => {
                if (!checkboxRefs.current["result"]) {
                  checkboxRefs.current["result"] = [];
                }
                checkboxRefs.current["result"][0] = el;
              }}
              checked
            />
            <input
              type="number"
              className={classes.input1}
              value={result}
              disabled
            />
          </div>
          <label className={classes.outputlabel}>Final Output y </label>
        </div>
      </div>

      <div className={classes.row}>
        <div className={classes.cardRow}>
          {functions.slice(3).map((func) => (
            <FunctionCard
              key={func.id}
              func={func}
              updateEquation={updateEquation}
              functions={functions}
              checkboxRefs={checkboxRefs}
              classes={classes}
            />
          ))}
        </div>
      </div>
      <svg className={classes.image}>
        {lineCoordinates.map((line, idx) => (
          <line
            key={idx}
            x1={line.x1 - 3}
            y1={line.y1}
            x2={line.x2 - 3}
            y2={line.y2}
            className={classes.line}
          />
        ))}
      </svg>
    </div>
  );
};

export default App;
