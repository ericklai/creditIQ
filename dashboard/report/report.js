const assessment = JSON.parse(localStorage.getItem("creditiqAssessment") || "null");

function formatMoney(amount) {
    return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        maximumFractionDigits: 0
    }).format(amount || 0);
}

function formatPercent(value) {
    return `${(value || 0).toFixed(1)}%`;
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

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}

if (!assessment) {
    document.getElementById("emptyState").style.display = "block";
} else {
    document.getElementById("reportContent").style.display = "block";

    const submittedDate = new Date(assessment.submittedAt);
    setText("reportDate", `Generated ${submittedDate.toLocaleDateString("en-KE", {
        year: "numeric",
        month: "long",
        day: "numeric"
    })}`);

    setText("creditScore", assessment.metrics.creditScore);
    setText("riskLevel", `${assessment.metrics.riskLevel} Risk`);
    setText("totalIncome", formatMoney(assessment.income.totalIncome));
    setText("totalExpenses", formatMoney(assessment.expenses.totalExpenses));
    setText("disposableIncome", formatMoney(assessment.metrics.disposableIncome));
    setText("monthlyDebt", formatMoney(assessment.debt.monthlyDebtPayment));
    setText("loanDecision", assessment.loan.decision);
    setText("requestedLoan", formatMoney(assessment.loan.loanAmount));
    setText("recommendedLoan", formatMoney(assessment.loan.recommendedLoan));
    setText("expenseRatio", formatPercent(assessment.metrics.expenseRatio));
    setText("debtRatio", formatPercent(assessment.metrics.debtToIncomeRatio));
    setText("savingsRate", formatPercent(assessment.metrics.savingsRate));
    setText("loanCoverage", `${(assessment.metrics.loanCoverageRatio || 0).toFixed(2)}x`);
    setText("incomeSource", formatLabel(assessment.income.incomeSource));
    setText("employmentStatus", formatLabel(assessment.income.employmentStatus));
    setText("missedPayments", formatLabel(assessment.debt.missedPayments));
    setText("emergencyFund", formatLabel(assessment.savings.emergencyFund));

    const list = document.getElementById("recommendationList");
    assessment.recommendations.forEach(function(recommendation) {
        const item = document.createElement("li");
        item.textContent = recommendation;
        list.appendChild(item);
    });
}
