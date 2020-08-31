const fromSelect = document.querySelector('[name="from_currency"]');
const fromInput = document.querySelector('[name="from_amount"]');
const toSelect = document.querySelector('[name="to_currency"]');
const form = document.querySelector('.app form');
const toEl = document.querySelector('.to_amount');

const endpoint = `https://api.exchangeratesapi.io/latest`;
// cash object, where we're going to store the rates that we've already asked for
const ratesByBase = {};

const currencies = {
	USD: 'United States Dollar',
	AUD: 'Australian Dollar',
	BGN: 'Bulgarian Lev',
	BRL: 'Brazilian Real',
	CAD: 'Canadian Dollar',
	CHF: 'Swiss Franc',
	CNY: 'Chinese Yuan',
	CZK: 'Czech Republic Koruna',
	DKK: 'Danish Krone',
	GBP: 'British Pound Sterling',
	HKD: 'Hong Kong Dollar',
	HRK: 'Croatian Kuna',
	HUF: 'Hungarian Forint',
	IDR: 'Indonesian Rupiah',
	ILS: 'Israeli New Sheqel',
	INR: 'Indian Rupee',
	JPY: 'Japanese Yen',
	KRW: 'South Korean Won',
	MXN: 'Mexican Peso',
	MYR: 'Malaysian Ringgit',
	NOK: 'Norwegian Krone',
	NZD: 'New Zealand Dollar',
	PHP: 'Philippine Peso',
	PLN: 'Polish Zloty',
	RON: 'Romanian Leu',
	RUB: 'Russian Ruble',
	SEK: 'Swedish Krona',
	SGD: 'Singapore Dollar',
	THB: 'Thai Baht',
	TRY: 'Turkish Lira',
	ZAR: 'South African Rand',
	EUR: 'Euro',
};


function generateOptions(options) {
	return Object
		.entries(options)
		.map(([currencyCode, currencyName]) => {
			return `
				<option value="${currencyCode}">
					${currencyCode} - ${currencyName}
				</option>
			`
		})
		.join('');
}

// default base parameter set to USD
async function fetchRate(base = "USD") {
	const res = await fetch(`${endpoint}?base=${base}`);
	const rates = await res.json();
	return rates;
}

async function convert(amount, from, to) {
	// first check if we even have the rates to convert from the currency
	if (!ratesByBase[from]) {
		console.log(`Oh no we don't have ${from} to convert to ${to}. Let's get it`);
		const rates = await fetchRate(from);
		console.log(rates);
		//store them for next time if CAD, store them to `ratesByBase.CAD`;
		ratesByBase[from] = rates;
	}

	const rate = ratesByBase[from].rates[to];
	const convertedAmount = rate * amount;
	console.log(`${amount} ${from} is ${convertedAmount} in ${to}`);
	return convertedAmount;
}

function formatCurrency(amount, currency) {
	return Intl.NumberFormat('en-US', {
		style: 'currency',
		currency
	}).format(amount);
}

async function handleInput(e) {
	const rawAmount = await convert(
		fromInput.value,
		fromSelect.value,
		toSelect.value
	);
	console.log(rawAmount);
	toEl.textContent = formatCurrency(rawAmount, toSelect.value);
}


const optionsHtml = generateOptions(currencies);
console.log(optionsHtml);
fromSelect.innerHTML = optionsHtml;
toSelect.innerHTML = optionsHtml;

form.addEventListener('input', handleInput);