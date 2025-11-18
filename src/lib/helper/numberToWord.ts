export function numberToWords(amount) {
  const ones = [
    "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
    "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
    "seventeen", "eighteen", "nineteen"
  ];
  const tens = [
    "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"
  ];
  const units = ["", "thousand", "million", "billion"];

  function convertBelowThousand(n, useAnd) {
    if (n < 20) return ones[n];
    if (n < 100)
      return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? "-" + ones[n % 10] : "");
    return (
      ones[Math.floor(n / 100)] +
      " hundred" +
      (n % 100 !== 0
        ? (useAnd ? " and " : " ") + convertBelowThousand(n % 100, useAnd)
        : "")
    );
  }

  function convertNumberToWords(n, useAnd) {
    if (n === 0) return "";
    let i = 0;
    let words = "";
    while (n > 0) {
      const chunk = n % 1000;
      if (chunk !== 0) {
        let chunkWords = convertBelowThousand(chunk, useAnd);
        if (units[i]) chunkWords += " " + units[i];
        words = chunkWords + (words ? " " + words : "");
      }
      n = Math.floor(n / 1000);
      i++;
    }
    return words.trim();
  }

  function toTitleCase(str) {
    return str
      .split(" ")
      .map(word =>
        word.includes("-")
          ? word
              .split("-")
              .map(w => w.charAt(0).toUpperCase() + w.slice(1))
              .join("-")
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  }

  const safeAmount = parseFloat(amount || 0);
  if (safeAmount === 0) return "";

  const [intPartStr, decimalPartStr] = safeAmount.toFixed(2).split(".");
  const intPart = parseInt(intPartStr);
  const decimalPart = parseInt(decimalPartStr);
  const hasHalalah = decimalPart > 0;

  const intWords = toTitleCase(convertNumberToWords(intPart, !hasHalalah));
  // const intWords = convertNumberToWords(intPart, !hasHalalah).toUpperCase();

  const halalahWords = hasHalalah ? ` And ${decimalPart} Halalah` : "";
  const onlyWord = " Only";

  return `${intWords} Saudi Riyal${halalahWords}${onlyWord}`;
}
