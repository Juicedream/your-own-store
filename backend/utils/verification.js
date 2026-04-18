const generateVerificationID = (id) => {
  const randomNums = Math.floor(Math.random() * 999) + 1000;
  const alphas = ["A", "b", "p", "W", "i", "Z", "a", "x", "U", "t"];
  let alp = "";
  for (let i = 0; i < alphas.length; i++) {
    if (alp.length > 1) {
      break;
    } else {
      let index = Math.floor(Math.random() * alphas.length);
      alp += alphas[index];
    }
  }
  const vID = `${alp}${randomNums}${id}`;
  return vID;
};

const generateOtpCode = () => {
  let randomNums = "";
  for (let i = 1; i < 6; i++) {
    randomNums = (Math.floor(Math.random() * 999999) + 100000).toString();
    if (randomNums.length === 6) {
      break;
    }
  }
  return randomNums;
};
module.exports = { generateVerificationID, generateOtpCode };
