export const validateEquation = (equation: string): boolean => {
  return /^[\d+x^+\-*/\s]+$/.test(equation);
};

export const evaluateEquation = (equation: string, x: number): number => {
  try {
    const sanitizedEquation = equation
      .replace(/(\d)(x)/g, "$1*$2")
      .replace(/\^/g, "**")
      .replace(/x/g, `(${x})`);

    const func = new Function("return " + sanitizedEquation);
    return func();
  } catch {
    return x;
  }
};
