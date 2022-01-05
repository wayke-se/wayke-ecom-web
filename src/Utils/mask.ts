export const maskText = (text: string) => {
  if (text.length < 2) {
    return text;
  } else if (text.length === 2) {
    return `${text.substring(0, 1)}***`;
  } else if (text.length === 3) {
    return `${text.substring(0, 2)}***`;
  }
  return `${text.substring(0, 3)}***`;
};

export const maskSSn = (ssn: string) => `${ssn.substring(0, ssn.length - 4)}****`;
