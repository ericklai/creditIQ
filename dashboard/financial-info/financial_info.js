const financialForm = document.getElementById("financialForm");

const storageKeys = {
    assessment: "creditiqAssessment",
    profile: "creditiqProfile"
};

function getValue(id) {
    const element = document.getElementById(id);

    if (!element) {
        return 0;
    }

    const value = parseFloat(element.value);

    return Number.isNaN(value) ? 0 : value;
}

function getTextValue(id) {
    const element = document.getElementById(id);

    return element ? element.value : "";
}

function formatMoney(amount) {
    return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        maximumFractionDigits: 0
    }).format(amount);
}

function formatLabel(value) {
    if (!value) {
        return "Not provided";
    }

    return value
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/-/g, " ")
        .replace(/\b\w/g, function(character) {
            return character.toUpperCase();
        });
}

function calculateMetrics() {
    const monthlyIncome = getValue("monthlyIncome");
    const otherIncome = getValue("otherIncome");
    const totalIncome = monthlyIncome + otherIncome;

    const rent = getValue("rent");
    const food = getValue("food");
    const transport = getValue("transport");
    const utilities = getValue("utilities");
    const otherExpenses = getValue("otherExpenses");
    const totalExpenses = rent + food + transport + utilities + otherExpenses;

    const totalDebt = getValue("totalDebt");
    const monthlyDebtPayment = getValue("monthlyDebtPayment");
    const activeLoans = getValue("activeLoans");
    const currentSavings = getValue("currentSavings");
    const monthlySavings = getValue("monthlySavings");
    const loanAmount = getValue("loanAmount");
    const repaymentPeriod = getValue("repaymentPeriod");
    const estimatedLoanPayment = repaymentPeriod > 0 ? loanAmount / repaymentPeriod : 0;

    const disposableIncome = totalIncome - totalExpenses - monthlyDebtPayment;
    const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
    const debtToIncomeRatio = totalIncome > 0 ? (monthlyDebtPayment / totalIncome) * 100 : 0;
    const savingsRate = totalIncome > 0 ? (monthlySavings / totalIncome) * 100 : 0;
    const loanCoverageRatio = estimatedLoanPayment > 0
        ? disposableIncome / estimatedLoanPayment
        : 0;

    let score = 300;

    if (totalIncome >= 30000) {
        score += 90;
    } else if (totalIncome >= 15000) {
        score += 55;
    }

    if (expenseRatio <= 55) {
        score += 110;
    } else if (expenseRatio <= 75) {
        score += 65;
    } else {
        score += 20;
    }

    if (debtToIncomeRatio <= 20) {
        score += 120;
    } else if (debtToIncomeRatio <= 35) {
        score += 70;
    } else {
        score += 15;
    }

    if (savingsRate >= 15) {
        score += 90;
    } else if (savingsRate >= 5) {
        score += 45;
    }

    if (getTextValue("emergencyFund") === "yes") {
        score += 45;
    }

    if (getTextValue("missedPayments") === "never") {
        score += 70;
    } else if (getTextValue("missedPayments") === "once") {
        score += 35;
    }

    if (getTextValue("empDuration") === "moreThan3Years") {
        score += 70;
    } else if (getTextValue("empDuration") === "1to3Years") {
        score += 45;
    }

    score = Math.max(300, Math.min(850, Math.round(score)));

    const riskLevel = score >= 720
        ? "Low"
        : score >= 620
            ? "Moderate"
            : "High";

    const recommendedLoan = Math.max(
        0,
        Math.min(loanAmount || disposableIncome * 3, disposableIncome * 3)
    );

    const approved =
        totalIncome > 0 &&
        disposableIncome > 0 &&
        debtToIncomeRatio <= 35 &&
        expenseRatio <= 80 &&
        (loanAmount === 0 || loanCoverageRatio >= 1.2);

    const recommendations = [];

    if (expenseRatio > 65) {
        recommendations.push("Reduce monthly expenses to improve affordability.");
    }

    if (debtToIncomeRatio > 30) {
        recommendations.push("Lower debt repayments before taking on a new loan.");
    }

    if (savingsRate < 10) {
        recommendations.push("Increase monthly savings toward at least 10% of income.");
    }

    if (getTextValue("missedPayments") !== "never") {
        recommendations.push("Keep future repayments on time to strengthen credit history.");
    }

    if (recommendations.length === 0) {
        recommendations.push("Maintain the current balance between income, expenses, debt, and savings.");
    }

    return {
        submittedAt: new Date().toISOString(),
        income: {
            monthlyIncome,
            otherIncome,
            totalIncome,
            incomeSource: getTextValue("incomeSource"),
            employmentStatus: getTextValue("empStatus"),
            employmentDuration: getTextValue("empDuration")
        },
        expenses: {
            rent,
            food,
            transport,
            utilities,
            otherExpenses,
            totalExpenses
        },
        debt: {
            hasDebt: getTextValue("hasDebt"),
            totalDebt,
            monthlyDebtPayment,
            activeLoans,
            missedPayments: getTextValue("missedPayments")
        },
        savings: {
            currentSavings,
            monthlySavings,
            savingFrequency: getTextValue("savingFrequency"),
            emergencyFund: getTextValue("emergencyFund")
        },
        business: {
            businessOwner: getTextValue("businessOwner"),
            businessType: getTextValue("businessType"),
            businessDuration: getTextValue("businessDuration")
        },
        loan: {
            loanAmount,
            loanPurpose: getTextValue("loanPurpose"),
            repaymentPeriod,
            estimatedLoanPayment,
            recommendedLoan,
            decision: approved ? "Eligible" : "Review Required"
        },
        metrics: {
            disposableIncome,
            expenseRatio,
            debtToIncomeRatio,
            savingsRate,
            loanCoverageRatio,
            creditScore: score,
            riskLevel
        },
        recommendations
    };
}

function displayMetrics() {
    const assessment = calculateMetrics();
    const metrics = assessment.metrics;

    document.getElementById("totalIncome").textContent =
        formatMoney(assessment.income.totalIncome);
    document.getElementById("totalExpenses").textContent =
        formatMoney(assessment.expenses.totalExpenses);
    document.getElementById("disposableIncome").textContent =
        formatMoney(metrics.disposableIncome);
    document.getElementById("debtRatio").textContent =
        metrics.debtToIncomeRatio.toFixed(1) + "%";
    document.getElementById("savingsRate").textContent =
        metrics.savingsRate.toFixed(1) + "%";
    document.getElementById("expenseRatio").textContent =
        metrics.expenseRatio.toFixed(1) + "%";
}

function saveProfileSummary(assessment) {
    const existingProfile = JSON.parse(
        localStorage.getItem(storageKeys.profile) || "{}"
    );

    const nextProfile = {
        ...existingProfile,
        applicantType: assessment.business.businessOwner === "yes"
            ? "Business Owner"
            : formatLabel(assessment.income.employmentStatus),
        incomeSource: formatLabel(assessment.income.incomeSource),
        lastAssessmentAt: assessment.submittedAt
    };

    localStorage.setItem(storageKeys.profile, JSON.stringify(nextProfile));
}

if (financialForm) {
    financialForm
        .querySelectorAll("input, select")
        .forEach(function(field) {
            field.addEventListener("input", displayMetrics);
            field.addEventListener("change", displayMetrics);
        });

    financialForm.addEventListener("reset", function() {
        window.setTimeout(displayMetrics, 0);
    });

    financialForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const assessment = calculateMetrics();

        if (assessment.income.totalIncome <= 0) {
            alert("Please enter a valid monthly income.");
            return;
        }

        if (assessment.metrics.disposableIncome < 0) {
            alert("Your expenses and debt repayments are higher than your income. Please check the information provided.");
            return;
        }

        localStorage.setItem(storageKeys.assessment, JSON.stringify(assessment));
        saveProfileSummary(assessment);
        displayMetrics();

        window.location.href = "../report/report.html";
    });

    displayMetrics();
}
