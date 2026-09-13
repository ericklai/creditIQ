 document
            .getElementById("financialForm")
            .addEventListener("submit", function(event) {

                event.preventDefault();

                alert(
                    "Financial information submitted successfully!"
                );

            });

// =========================================
// CREDITIQ - FINANCIAL METRICS
// =========================================

const financialForm = document.getElementById("financialForm");


// =========================================
// GET INPUT VALUE
// =========================================

function getValue(id) {
    const element = document.getElementById(id);

    if (!element) {
        return 0;
    }

    const value = parseFloat(element.value);

    return isNaN(value) ? 0 : value;
}


// =========================================
// FORMAT MONEY
// =========================================

function formatMoney(amount) {
    return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        maximumFractionDigits: 0
    }).format(amount);
}


// =========================================
// CALCULATE FINANCIAL METRICS
// =========================================

function calculateMetrics() {

    // -------------------------
    // INCOME
    // -------------------------

    const monthlyIncome = getValue("monthlyIncome");
    const otherIncome = getValue("otherIncome");

    const totalIncome = monthlyIncome + otherIncome;


    // -------------------------
    // EXPENSES
    // -------------------------

    const rent = getValue("rent");
    const food = getValue("food");
    const transport = getValue("transport");
    const utilities = getValue("utilities");
    const otherExpenses = getValue("otherExpenses");

    const totalExpenses =
        rent +
        food +
        transport +
        utilities +
        otherExpenses;


    // -------------------------
    // DEBT
    // -------------------------

    const totalDebt = getValue("totalDebt");

    const monthlyDebtPayment =
        getValue("monthlyDebtPayment");

    const activeLoans =
        getValue("activeLoans");


    // -------------------------
    // SAVINGS
    // -------------------------

    const currentSavings =
        getValue("currentSavings");

    const monthlySavings =
        getValue("monthlySavings");


    // =========================================
    // CALCULATED METRICS
    // =========================================

    // Disposable income
    const disposableIncome =
        totalIncome - totalExpenses - monthlyDebtPayment;


    // Expense ratio
    const expenseRatio =
        totalIncome > 0
            ? (totalExpenses / totalIncome) * 100
            : 0;


    // Debt-to-income ratio
    const debtToIncomeRatio =
        totalIncome > 0
            ? (monthlyDebtPayment / totalIncome) * 100
            : 0;


    // Savings rate
    const savingsRate =
        totalIncome > 0
            ? (monthlySavings / totalIncome) * 100
            : 0;


    // Debt-to-income including requested loan is
    // something we'll calculate later.


    return {
        monthlyIncome,
        otherIncome,
        totalIncome,

        rent,
        food,
        transport,
        utilities,
        otherExpenses,
        totalExpenses,

        totalDebt,
        monthlyDebtPayment,
        activeLoans,

        currentSavings,
        monthlySavings,

        disposableIncome,
        expenseRatio,
        debtToIncomeRatio,
        savingsRate
    };
}


// =========================================
// DISPLAY RESULTS
// =========================================

function displayMetrics() {

    const metrics = calculateMetrics();


    // Total income
    document.getElementById("totalIncome").textContent =
        formatMoney(metrics.totalIncome);


    // Total expenses
    document.getElementById("totalExpenses").textContent =
        formatMoney(metrics.totalExpenses);


    // Disposable income
    document.getElementById("disposableIncome").textContent =
        formatMoney(metrics.disposableIncome);


    // Debt-to-income ratio
    document.getElementById("debtRatio").textContent =
        metrics.debtToIncomeRatio.toFixed(1) + "%";


    // Savings rate
    document.getElementById("savingsRate").textContent =
        metrics.savingsRate.toFixed(1) + "%";


    // Expense ratio
    document.getElementById("expenseRatio").textContent =
        metrics.expenseRatio.toFixed(1) + "%";
}


// =========================================
// LIVE CALCULATION
// =========================================

// Find all number inputs

const numberInputs =
    financialForm.querySelectorAll(
        'input[type="number"]'
    );


// Recalculate whenever the user changes
// a financial value.

numberInputs.forEach(function(input) {

    input.addEventListener("input", function() {

        displayMetrics();

    });

});


// =========================================
// FORM SUBMISSION
// =========================================

financialForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const metrics = calculateMetrics();


    // Basic validation

    if (metrics.totalIncome <= 0) {

        alert(
            "Please enter a valid monthly income."
        );

        return;
    }


    if (metrics.disposableIncome < 0) {

        alert(
            "Your expenses and debt repayments are higher than your income. Please check the information provided."
        );

        return;
    }


    // Display final metrics

    displayMetrics();


    alert(
        "Financial information calculated successfully!"
    );

});
