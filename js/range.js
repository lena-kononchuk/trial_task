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
        type: "double",
        grid: true,
        min: minSum,
        max: maxSum,
        // from: minSum, // Left slider initial value
       to: 2000,   // Right slider initial value
        postfix: ' €',
        onStart: function (data) {
            sum = data.to; // Use 'data.to' for the right slider's initial value
            addMarks($sliderSum, marksSum, minSum, maxSum); // Updated to add marks
            updateProfit(); // Update profit on start
        },
        onChange: function (data) {
            sum = data.to; // Use 'data.to' to control the right slider value
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
            addMarks($sliderMonths, marksMonths, minMonths, maxMonths, true); // Add marks for months, passing `true`
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
    let profitRate = 4.3; // Profit rate (4.3 for €2000 to yield €8600)
    return amount * profitRate * months; // Profit for the specified months
}

// Function to update the displayed profit
function updateProfit() {
    const profit = Math.round(calculateProfit(sum, months)); // Округление до целого числа
    $('.profit-text').text('MOGUĆA DOBIT:'); // Обновляем текст
    $('.profit-amount').text(`€ ${profit}`); // Обновляем сумму с € символом
}
// Main function
$(function () {
    // Initialize sliders when the page loads
    initializeSumSlider();
    initializeMonthsSlider();
});
