
let empty_result      = document.getElementById("empty-result");
let completed_result  = document.getElementById("completed-results");
let form              = document.getElementById("mortage_repayement_form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let repayement_result = document.getElementById("repayement-result");
    let repay_over_result = document.getElementById("repay-over-result");

    let invalid_fields = get_invalid_fields();


    if (invalid_fields.length == 0) {

        let mortage = map_mortage_to_form(form);
        let monthlyPayment = mortage.calculateMonthlyPayment();

        repayement_result.innerHTML = '£' + monthlyPayment.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
        repay_over_result.innerHTML = '£' + (monthlyPayment * 12 * Number(form.term_duration.value)).toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });

        display_completed_result();

        return;
    }

    display_empty_result();

    console.log(typeof (form.amount.value))
})

function display_completed_result() {
    empty_result.style.display     = "none";
    completed_result.style.display = "flex";
}

function display_empty_result() {
    empty_result.style.display     = "block";
    completed_result.style.display = "none";
}

function get_invalid_fields() {

    let invalid_inputs = [];

    let is_fields_valid = form.amount.value && form.term_duration.value && form.interest_rate.value && form.mortage_type.value;

    if (!is_fields_valid) {
        !form.amount.value && invalid_inputs.push("amount");
        !form.term_duration.value && invalid_inputs.push("term_duration");
        !form.interest_rate.value && invalid_inputs.push("interest_rate");
        !form.mortage_type.value && invalid_inputs.push("mortage_type");

        return invalid_inputs;
    }

    return invalid_inputs;
}

function map_mortage_to_form() {

    return new Mortgage(
        Number(form.amount.value),
        Number(form.interest_rate.value),
        Number(form.term_duration.value),
        form.mortage_type.value
    )
}


class Mortgage {
    constructor(amount, interestRate, term_duration, mortage_type) {
        this.amount = amount; // Principal loan amount
        this.interestRate = interestRate; // Annual interest rate in percentage
        this.term_duration = term_duration; // Term of the loan in term_duration
        this.mortage_type = mortage_type; // mortage_type of mortgage: 'repayment' or 'interest-only'
    }

    // Calculate the monthly interest rate
    get monthlyInterestRate() {
        return this.interestRate / 100 / 12;
    }

    // Calculate the number of payments over the entire term of the loan
    get totalPayments() {
        return this.term_duration * 12;
    }

    // Calculate monthly payment for repayment mortgage
    calculateRepayment() {
        const r = this.monthlyInterestRate;
        const n = this.totalPayments;
        const P = this.amount;

        if (r === 0) {
            return P / n; // No interest scenario
        }

        const monthlyPayment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        return monthlyPayment;
    }

    // Calculate monthly payment for interest-only mortgage
    calculateInterestOnly() {
        const r = this.monthlyInterestRate;
        const P = this.amount;

        const monthlyPayment = P * r;
        return monthlyPayment;
    }

    // Calculate the monthly payment based on the mortage_type of mortgage
    calculateMonthlyPayment() {
        if (this.mortage_type === 'repayment') {
            return this.calculateRepayment();
        } else if (this.mortage_type === 'interest-only') {
            return this.calculateInterestOnly();
        } else {
            throw new Error('Invalid mortgage mortage_type. Choose either "repayment" or "interest-only".');
        }
    }
}

// Example usage:

const repaymentMortgage = new Mortgage(200000, 5, 20, 'repayment');
console.log(`Repayment Mortgage Monthly Payment: €${repaymentMortgage.calculateMonthlyPayment().toFixed(2)}`);

const interestOnlyMortgage = new Mortgage(200000, 5, 20, 'interest-only');
console.log(`Interest-Only Mortgage Monthly Payment: €${interestOnlyMortgage.calculateMonthlyPayment().toFixed(2)}`);
