import React from "react";
interface FunctionCardType {
  id: number;
  equation: string;
  nextFunction: number | null;
}
const FunctionCard = ({
  func,
  updateEquation,
  functions,
  checkboxRefs,
  classes,
}: {
  func: FunctionCardType;
  updateEquation: (id: number, equation: string) => void;
  functions: FunctionCardType[];
  checkboxRefs: React.MutableRefObject<any[]>;
  classes: any;
}) => {
  return (
    <div key={func.id} className={classes.card}>
      <div style={{ color: "#A5A5A5" }}>Function: {func.id}</div>
      <div className={classes.textType}>
        <span className={classes.text}>Equation</span>
        <input
          type="text"
          value={func.equation}
          onChange={(e) => updateEquation(func.id, e.target.value)}
          className={classes.input}
        />
      </div>
      <div className={classes.textType}>
        <span className={classes.text}>Next function</span>
        <select
          className={classes.select}
          disabled
          value={func.nextFunction ?? ""}
        >
          <option value="">None</option>
          {functions.map((f) => (
            <option key={f.id} value={f.id}>
              Function {f.id}
            </option>
          ))}
        </select>
      </div>
      <div
        className={classes.checkboxContainer}
        style={{ marginBottom: "20px" }}
      >
        {Array(2)
          .fill(0)
          .map((_, checkboxIndex) => (
            <>
              {checkboxIndex === 1 && (
                <span className={classes.inputLabel}>output</span>
              )}
              <input
                type="radio"
                key={`${func.id}-${checkboxIndex}`}
                ref={(el) => {
                  if (!checkboxRefs.current[func.id]) {
                    checkboxRefs.current[func.id] = [];
                  }
                  checkboxRefs.current[func.id][checkboxIndex] = el;
                }}
                checked
              />
              {checkboxIndex === 0 && (
                <span
                  className={classes.inputLabel}
                  style={{ marginRight: "60px" }}
                >
                  input
                </span>
              )}
            </>
          ))}
      </div>
    </div>
  );
};

export default FunctionCard;
