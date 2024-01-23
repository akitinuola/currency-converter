document.addEventListener("DOMContentLoaded", function () {
  let rate1 = document.querySelector(".rate1");
  let rate2 = document.querySelector(".rate2");
  let resultBtn = document.querySelector(".result");
  let selects = document.querySelectorAll(".options select");
  let sel1 = selects[0];
  let sel2 = selects[1];
  let inputs = document.querySelectorAll(".input input");
  let inpt1 = inputs[0];
  let inpt2 = inputs[1];

  let rates = {};
  let currencies = {};

  let requestURL = "https://floatrates.com/daily/USD.json";

  fetchRates();

  async function fetchRates() {
    let res = await fetch(requestURL);
    res = await res.json();
    rates = currencies = res;
    fetchCurrencies();
  }

  async function fetchCurrencies() {
    let res = await fetch('/assets/countries.json');
    res = await res.json();
    currencies = res;
    populateOptions();
  }

  function populateOptions() {
    let val = "";
    currencies.forEach((item) => {
      let str = '<option value="' + item.currency + '">' + item.name + ' ' + item.currency + "</option>";
      val += str;
    });
    selects.forEach((s) => (s.innerHTML = val));

    setInitialRates()
  }

  function setInitialRates() {
    selects[0].value = 'USD';
    selects[1].value = 'NGN';

    inputs[0].value = 1;

    displayRate()
  }

  async function fetchNewRates() {
    let v1 = selects[0].value;
    let res = await fetch(
      "https://floatrates.com/daily/" + v1 + ".json"
    );
    res = await res.json();
    rates = res;

    displayRate();
  }

  function convert(val, toCurr) {

    let v = val * rates[toCurr.toLowerCase()].rate;
    let v1 = v.toFixed(3);
    return (v1 = 0.0 ? v.toFixed(5) : v1);
  }

  function toggleError() {
    console.log("edf")
    document.getElementById("errorMessage").style.visibility = "visible";
    setTimeout(() => {
      document.getElementById("errorMessage").style.visibility = "hidden";
    }, 5000);
  }

  function displayRate() {
    document.getElementById("errorMessage").style.visibility = "hidden";
    // Check for Error
    if( isNaN(inputs[0].value) || inputs[0].value < 0 ||  inputs[0].value > 999999) {
      toggleError();
      return;
    }

    let v1 = selects[0].value;
    let v2 = selects[1].value;

    let val = convert(1, v2);

    rate1.innerHTML = "1 " + v1 + " equals";
    rate2.innerHTML = val + "  " + v2;

    let date = new Date(rates[v2.toLowerCase()].date);
    let ukDate = new Date(date.toLocaleString("en-US", { timeZone: "Europe/London" })).toLocaleString();

    document.getElementById("updateDate").innerText = ukDate;

    let fromVal = parseFloat(inputs[0].value);
    let toCurr = selects[1].value;

    if (isNaN(fromVal)) {
      alert("enter a number");
    } else {
      let cVal = convert(fromVal, toCurr);
      inputs[1].value = cVal;
    }
  }

  selects[0].addEventListener("change", fetchNewRates);

  selects[1].addEventListener("change", displayRate);

  resultBtn.addEventListener("click", displayRate);

  document.querySelector(".swap").addEventListener("click", () => {

    let in1 = inputs[0].value;
    let in2 = inputs[1].value;
    let op1 = selects[0].value;
    let op2 = selects[1].value;

    inputs[0].value = in2;
    inputs[1].value = in1;

    selects[0].value = op2;
    selects[1].value = op1;

    fetchNewRates()
  });
});
