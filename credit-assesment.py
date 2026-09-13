def assess_customer(
    monthly_income,
    monthly_expenses,
    existing_debts,
    employment_status,
    employment_months,
    previous_loans_count,
    previous_loans_repaid,
    late_payments,
    
):
    # Input validation
    if monthly_income <= 0:
        raise ValueError("Monthly income must be greater than 0.")
    if monthly_expenses < 0:
        raise ValueError("Monthly expenses cannot be negative.")
    if existing_debts < 0:
        raise ValueError("Existing debts cannot be negative.")
    if employment_months < 0:
        raise ValueError("Employment months cannot be negative.")
    if previous_loans_count < 0:
        raise ValueError("Previous loans count cannot be negative.")
    if previous_loans_repaid < 0:
        raise ValueError("Previous loans repaid cannot be negative.")
    if late_payments < 0:
        raise ValueError("Late payments cannot be negative.")

    disposable_income = monthly_income - monthly_expenses
    debt_to_income = existing_debts / monthly_income 
    if debt_to_income < 0.30:
        debt_assesment = "good"
    else:
        debt_assesment = "high"  # noqa: F841, RUF100

    if employment_status == "employed" and employment_months > 12:
        employment_assesment = "stable"
    else:
        employment_assesment = "unstable"
    if previous_loans_count == 0:
        repayment_rate = "none"
        repayment_assessment = "no history"
    else:
        repayment_rate = previous_loans_repaid / previous_loans_count
        if late_payments == 0 and repayment_rate >= 0.90:
            repayment_assessment = "good"
        else:
            repayment_assessment = "needs_review"
    if disposable_income >= monthly_income * 0.30:
        affordability_assessment = "good"
    else:
        affordability_assessment = "low"  # noqa: F841, RUF100
    risk_flags = []
    if debt_assesment == "good" and employment_assesment == "stable":
        overall_assessment = "good"
    else:
        overall_assessment = "needs_review"

    if debt_assesment == "high":
        risk_flags.append("High debt-to-income ratio")
    if employment_assesment == "unstable":
        risk_flags.append("Unstable employment")
    if repayment_assessment == "needs_review":
        risk_flags.append("Poor repayment history")
    if affordability_assessment == "low":
        risk_flags.append("Low affordability")
    if repayment_assessment == "no history":
        risk_flags.append("No loan history")

    if overall_assessment == "good" and affordability_assessment == "good":
        loan_decision = "approved"
    else:
        loan_decision = "rejected"
    if loan_decision == "approved":
        max_loan_amount = disposable_income * 3
    else:
        max_loan_amount = 0
    return {
        "disposable_income": disposable_income,
        "debt_to_income": debt_to_income,
        "employment_status": employment_status,
        "employment_months": employment_months,
        "employment_assessment": employment_assesment,
        "repayment_rate": repayment_rate,
        "repayment_assessment": repayment_assessment,
        "affordability_assessment": affordability_assessment,
        "overall_assessment": overall_assessment,
        "loan_decision": loan_decision,
        "max_loan_amount": max_loan_amount,
        "risk_flags": risk_flags,
        "rejection_reasons": risk_flags if loan_decision == "rejected" else [],
    }

results = assess_customer(monthly_income=float(input("Enter monthly income: ")),
                          monthly_expenses=float(input("Enter monthly expenses: ")),
                          existing_debts=float(input("Enter existing debts: ")),
                          employment_status=input("Enter employment status: "),
                          employment_months=int(input("Enter employment months: ")),
                          previous_loans_count=int(input("Enter previous loans count: ")),
                          previous_loans_repaid=int(input("Enter previous loans repaid: ")),
                          late_payments=int(input("Enter late payments: ")))

print("\n====CREDIT ASSESSMENT RESULTS====\n")
print(f"Disposable Income:ksh {results['disposable_income']:.2f}")
print(f"Debt to Income Ratio: {results['debt_to_income']:.2f}")
print(f"Employment Status: {results['employment_status']}")
print(f"Employment Months: {results['employment_months']}")
print(f"Employment Assessment: {results['employment_assessment']}")
print(f"Repayment Rate: {results['repayment_rate']:.2f}")
print(f"Repayment Assessment: {results['repayment_assessment']}")
print(f"Affordability Assessment: {results['affordability_assessment']}")
print(f"Overall Assessment: {results['overall_assessment']}")
print(f"Loan Decision: {results['loan_decision']}")
print(f"Max Loan Amount: ksh {results['max_loan_amount']:.2f}")
print(f"Risk Flags: {', '.join(results['risk_flags']) if results['risk_flags'] else 'None'}")
print(f"Rejection Reasons: {', '.join(results['rejection_reasons']) if results['rejection_reasons'] else 'None'}")
print("==================================")

