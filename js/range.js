// Variables for the amount slider
let minSum = 300; // Minimum amount
let maxSum = 15000; // Maximum amount
let marksSum = [3975, 7650, 11325, 15000]; // Mark points for the amount

// Variables for the month slider
let minMonths = 1; // Minimum number of months
let maxMonths = 12; // Maximum number of months
let marksMonths = [1, 3, 6, 9, 12]; // Mark points for the number of months

let sum = 2000; // Initial amount value set to 2000 to match the slider
let months = minMonths; // Initial number of months

// Function to convert values to percentage
function convertToPercent(num, min, max) {
    return (num - min) / (max - min) * 100;
}

// Function to add marks (labels) to the slider
function addMarks($slider, marks, min, max, isMonthSlider = false) {
    let html = '';
    let left = 0;

    for (let i = 0; i < marks.length; i++) {
        left = convertToPercent(marks[i], min, max); // Calculate the left position in percentage
        // Append "€" for amount or "months" for months
        html += '<span class="mark" style="left: ' + left + '%">' + marks[i] + (isMonthSlider ? ' months' : ' €') + '</span>';
    }

    $slider.append(html); // Append the marks to the slider container
}

// Function to initialize the amount slider
function initializeSumSlider() {
    const $sliderSum = $("#range-sum"); // ID of the amount slider

    $sliderSum.ionRangeSlider({
        type: "single",
        grid: true,
        min: minSum,
        max: maxSum,
        from: sum, // Set the initial value based on the variable sum
        postfix: ' €',
        onStart: function (data) {
            sum = data.from; // Set sum from initial value
            addMarks($sliderSum, marksSum, maxSum); // Updated to add marks
            updateProfit(); // Update profit on start
        },
        onChange: function (data) {
            sum = data.from; // Use data.from for the current slider value
            updateProfit(); // Update profit on change
        }
    });
}

// Function to initialize the months slider
function initializeMonthsSlider() {
    const $sliderMonths = $("#range-months"); // ID of the months slider

    $sliderMonths.ionRangeSlider({
        type: "single", // Changed to "single" for a single month value
        grid: true,
        min: minMonths,
        max: maxMonths,
        from: minMonths,
        step: 1,
        postfix: ' month',
        onStart: function (data) {
            months = data.from; // Update 'months' to reflect the slider's initial value
            addMarks($sliderMonths, marksMonths, minMonths, maxMonths, true); // Add marks for months
            updateProfit(); // Update profit on start
        },
        onChange: function (data) {
            months = data.from; // Update the months variable
            updateProfit(); // Update profit on change
        }
    });
}

// Function to calculate potential profit
function calculateProfit(amount, months) {
    let annualProfitRate = 430; // Profit rate as a percentage (430% annual)
    let monthlyProfitRate = annualProfitRate / 100; // Monthly profit rate as a decimal

    return amount * monthlyProfitRate * months; // Profit for the specified months
}

// Function to update the displayed profit
function updateProfit() {
    const profit = Math.round(calculateProfit(sum, months)); 
    $('.profit-text').text('MOGUĆA DOBIT:'); 
    $('.profit-amount').text(`€ ${profit}`); 
}

$(function () {
    // Initialize sliders when the page loads
    initializeSumSlider();
    initializeMonthsSlider();

    // Initial profit calculation on page load
    updateProfit();
});
