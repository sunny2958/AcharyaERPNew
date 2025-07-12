export const maskMobile = (number) => {
  if (number) {
    return number.length === 10
      ? number.slice(0, 2) + "xxxxxx" + number.slice(8)
      : number.length === 13
      ? number.slice(0, 5) + "xxxxxx" + number.slice(8)
      : number.length === 14
      ? number.slice(0, 5) + "xxxxxx" + number.slice(10)
      : "";
  }
};

export const maskEmail = (email) => {
  if (email) {
    const split = email.split("@");
    return email.substr(0, 2) + "********@" + split[1];
  }
};
