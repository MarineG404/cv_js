function calculateAge(birthDateString) {
	// Parse birth date (DD/MM/YYYY format)
	const [day, month, year] = birthDateString.split('/').map(Number);
	const birthDate = new Date(year, month - 1, day); // month in JS starts at 0

	const today = new Date();

	// Calculate age in years
	let age = today.getFullYear() - birthDate.getFullYear();

	// Adjust if birthday hasn't occurred yet this year
	const monthDiff = today.getMonth() - birthDate.getMonth();
	const dayDiff = today.getDate() - birthDate.getDate();

	if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
		age--;
	}

	// Calculate next birthday to get the days
	const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

	// If birthday already passed this year, take next year
	if (nextBirthday < today) {
		nextBirthday.setFullYear(today.getFullYear() + 1);
	}

	// Calculate last birthday
	const lastBirthday = new Date(nextBirthday);
	lastBirthday.setFullYear(nextBirthday.getFullYear() - 1);

	// Number of days since last birthday
	const daysSinceBirthday = Math.floor((today - lastBirthday) / (1000 * 60 * 60 * 24));

	// Calculate months, weeks, and days
	const months = Math.floor(daysSinceBirthday / 30);
	const remainingDaysAfterMonths = daysSinceBirthday % 30;
	const weeks = Math.floor(remainingDaysAfterMonths / 7);
	const days = remainingDaysAfterMonths % 7;

	return {
		years: age,
		months: months,
		weeks: weeks,
		days: days
	};
}

function formatAge(birthDateString) {
	const { years, months, weeks, days } = calculateAge(birthDateString);
	return `${years} ans, ${months} mois, ${weeks} semaine${weeks > 1 ? 's' : ''} et ${days} jour${days > 1 ? 's' : ''}`;
}

function formatAgeSimple(birthDateString) {
	const { years } = calculateAge(birthDateString);
	return `${years} ans`;
}
