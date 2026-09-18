const assessment = JSON.parse(localStorage.getItem("creditiqAssessment") || "null");
const profile = JSON.parse(localStorage.getItem("creditiqProfile") || "{}");

function formatMoney(amount) {
    return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        maximumFractionDigits: 0
    }).format(amount || 0);
}

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}

function logout() {
    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {
        window.location.href = "../auth/login.html";
    }
}

const displayName = profile.fullName || profile.username || "User";
const initial = displayName.trim().charAt(0).toUpperCase() || "U";

setText("username", displayName.split(" ")[0]);

const profileIcon = document.querySelector(".profile-icon");
if (profileIcon) {
    profileIcon.textContent = initial;
}

if (assessment) {
    setText("creditScore", assessment.metrics.creditScore);
    setText("riskLevel", assessment.metrics.riskLevel);
    setText("eligibility", assessment.loan.decision);
    setText("requestedLoan", formatMoney(assessment.loan.loanAmount));
    setText("recommendedLoan", formatMoney(assessment.loan.recommendedLoan));
    setText("assessmentStatus", "Completed");
    setText("profileProgress", "100%");
    setText("profileStatusText", "Your financial information has been submitted and assessed.");

    const progressBar = document.getElementById("progressBar");
    if (progressBar) {
        progressBar.style.width = "100%";
    }
}
