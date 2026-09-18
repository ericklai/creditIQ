const profileKey = "creditiqProfile";
const assessmentKey = "creditiqAssessment";

const profileForm = document.getElementById("profileForm");
const saveMessage = document.getElementById("saveMessage");

function formatMoney(amount) {
    return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        maximumFractionDigits: 0
    }).format(amount || 0);
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

function getProfile() {
    return JSON.parse(localStorage.getItem(profileKey) || "{}");
}

function getAssessment() {
    return JSON.parse(localStorage.getItem(assessmentKey) || "null");
}

function renderProfile() {
    const profile = getProfile();
    const assessment = getAssessment();

    document.getElementById("fullName").value = profile.fullName || "";
    document.getElementById("username").value = profile.username || "";
    document.getElementById("email").value = profile.email || "";
    document.getElementById("phone").value = profile.phone || "";
    document.getElementById("location").value = profile.location || "";
    document.getElementById("applicantType").value = profile.applicantType || "";

    const displayName = profile.fullName || profile.username || "CreditIQ User";
    const initial = displayName.trim().charAt(0).toUpperCase() || "U";

    setText("profileName", displayName);
    setText("avatar", initial);
    setText(
        "profileMeta",
        [profile.applicantType, profile.location].filter(Boolean).join(" · ") ||
            "Profile details and financial readiness summary."
    );

    if (!assessment) {
        return;
    }

    setText("creditScore", assessment.metrics.creditScore);
    setText("riskLevel", `${assessment.metrics.riskLevel} Risk`);
    setText("loanDecision", assessment.loan.decision);
    setText("monthlyIncome", formatMoney(assessment.income.totalIncome));
    setText("disposableIncome", formatMoney(assessment.metrics.disposableIncome));

    const submittedDate = new Date(assessment.submittedAt);
    setText("lastUpdated", submittedDate.toLocaleDateString("en-KE", {
        year: "numeric",
        month: "short",
        day: "numeric"
    }));

    if (!profile.applicantType) {
        document.getElementById("applicantType").value =
            assessment.business.businessOwner === "yes"
                ? "Business Owner"
                : formatLabel(assessment.income.employmentStatus);
    }
}

profileForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const nextProfile = {
        ...getProfile(),
        fullName: document.getElementById("fullName").value.trim(),
        username: document.getElementById("username").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        location: document.getElementById("location").value.trim(),
        applicantType: document.getElementById("applicantType").value
    };

    localStorage.setItem(profileKey, JSON.stringify(nextProfile));
    saveMessage.textContent = "Profile saved.";
    renderProfile();

    window.setTimeout(function() {
        saveMessage.textContent = "";
    }, 2500);
});

renderProfile();
