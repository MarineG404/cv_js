async function loadDataAndRender() {
	try {
		const res = await fetch('../data/data.json');
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const profilData = await res.json();
		renderCv(profilData);
	} catch (err) {
		console.error('Failed to load data.json', err);
		const errDiv = document.createElement('div');
		errDiv.style.color = 'red';
		errDiv.textContent = 'Erreur de chargement des données.';
		document.body.appendChild(errDiv);
	}
}

function renderCv(profilData) {

	const cv = document.createElement("div");
	cv.id = "cv";
	document.body.appendChild(cv);

	const sidebar = document.createElement("div");
	sidebar.id = "sidebar";

	const main = document.createElement("div");
	main.id = "main";

	cv.appendChild(sidebar);
	cv.appendChild(main);

	const subtitle = document.createElement("h1");
	subtitle.id = "title";
	subtitle.textContent = `${profilData.name} - ${profilData.post}`;
	main.appendChild(subtitle);

	const profileSection = document.createElement("div");
	profileSection.id = "profile-section";

	const profileContent = document.createElement("div");
	profileContent.id = "profile";
	profileContent.textContent = profilData.summary;
	profileSection.appendChild(profileContent);

	main.appendChild(profileSection);


	// SIDEBAR - Order: GitHub Widget, Info, Contact, Skills, Languages, Interests

	// // 1. GitHub Widget
	// if (profilData.github) {
	// 	renderGitHubWidget(profilData.github, sidebar).catch(err => {
	// 		console.warn('GitHub widget failed', err);
	// 	});
	// }

	// 2. Profile Picture
	const profilePic = document.createElement("img");
	profilePic.id = "profile-pic";
	profilePic.src = "../img/image.png";
	profilePic.alt = "Profile Picture";
	sidebar.appendChild(profilePic);

	// 3. Contact
	if (profilData.contact && profilData.contact.length) {
		const contactTitle = document.createElement("h2");
		contactTitle.textContent = "Contact";
		sidebar.appendChild(contactTitle);
		const contactContainer = document.createElement("div");
		contactContainer.className = "contact-container";

		// Map contact types to Remix Icon classes and links
		const iconMap = {
			location: "ri-map-pin-line",
			phone: "ri-phone-line",
			email: "ri-mail-line",
			github: "ri-github-line",
			website: "ri-global-line",
			linkedin: "ri-linkedin-box-line",
			age: "ri-cake-line",
			car: "ri-car-line"
		};

		profilData.contact.forEach(item => {
			const contactItem = document.createElement("div");
			contactItem.className = "contact-item";

			const icon = document.createElement("i");
			icon.className = iconMap[item.type] || "ri-information-line";
			contactItem.appendChild(icon);

			// Special handling for age
			if (item.type === "age") {
				// Use function from age-calculator.js script
				const ageText = formatAge(item.label);
				const text = document.createTextNode(" " + ageText);
				contactItem.appendChild(text);
			} else if (item.type === "email") {
				const link = document.createElement("a");
				link.href = `mailto:${item.label}`;
				link.textContent = item.label;
				contactItem.appendChild(document.createTextNode(" "));
				contactItem.appendChild(link);
			} else if (item.type === "github") {
				const link = document.createElement("a");
				link.href = `https://github.com/${item.label}`;
				link.target = "_blank";
				link.rel = "noopener";
				link.textContent = item.label;
				contactItem.appendChild(document.createTextNode(" "));
				contactItem.appendChild(link);
			} else if (item.type === "website") {
				const link = document.createElement("a");
				link.href = `https://${item.label}`;
				link.target = "_blank";
				link.rel = "noopener";
				link.textContent = item.label;
				contactItem.appendChild(document.createTextNode(" "));
				contactItem.appendChild(link);
			} else if (item.type === "linkedin") {
				const link = document.createElement("a");
				// Extract URL from label if it contains "LinkedIn :"
				const linkText = item.label;
				link.href = "https://www.linkedin.com/in/marine-gonnord-7a1517234/";
				link.target = "_blank";
				link.rel = "noopener";
				link.textContent = linkText;
				contactItem.appendChild(document.createTextNode(" "));
				contactItem.appendChild(link);
			} else {
				const text = document.createTextNode(" " + item.label);
				contactItem.appendChild(text);
			}

			contactContainer.appendChild(contactItem);
		});
		sidebar.appendChild(contactContainer);
	}

	// 4. Skills
	const skillsTitle = document.createElement("h2");
	skillsTitle.textContent = "Compétences";
	sidebar.appendChild(skillsTitle);
	const skillsContainer = document.createElement("div");
	skillsContainer.id = "skills";
	Object.keys(profilData.skills).forEach(category => {
		const categoryTitle = document.createElement("h3");
		categoryTitle.textContent = category;
		skillsContainer.appendChild(categoryTitle);
		const skillsGrid = document.createElement("div");
		skillsGrid.className = "skills-grid";
		profilData.skills[category].forEach(skill => {
			const skillBadge = document.createElement("span");
			skillBadge.className = "skill-badge";
			skillBadge.textContent = skill;
			skillsGrid.appendChild(skillBadge);
		});
		skillsContainer.appendChild(skillsGrid);
	});
	sidebar.appendChild(skillsContainer);

	// 5. Languages
	if (profilData.langues && profilData.langues.length) {
		const languesTitle = document.createElement("h2");
		languesTitle.textContent = "Langues";
		sidebar.appendChild(languesTitle);
		const languesGrid = document.createElement("div");
		languesGrid.className = "langues-grid";
		profilData.langues.forEach(lang => {
			const key = Object.keys(lang)[0];
			const langCard = document.createElement("div");
			langCard.className = "langue-card";

			const langName = document.createElement("div");
			langName.className = "langue-name";
			langName.textContent = key;

			const langLevel = document.createElement("div");
			langLevel.className = "langue-level";
			langLevel.textContent = lang[key];

			langCard.appendChild(langName);
			langCard.appendChild(langLevel);
			languesGrid.appendChild(langCard);
		});
		sidebar.appendChild(languesGrid);
	}

	// 6. Interests
	if (profilData.other && profilData.other.length) {
		const otherTitle = document.createElement("h2");
		otherTitle.textContent = "Centres d'intérêt";
		sidebar.appendChild(otherTitle);
		const otherGrid = document.createElement("div");
		otherGrid.className = "other-grid";
		profilData.other.forEach(item => {
			const badge = document.createElement("div");
			badge.className = "interest-badge";
			badge.setAttribute("data-tooltip", item.desc);
			const title = document.createElement("span");
			title.textContent = item.title;
			badge.appendChild(title);
			otherGrid.appendChild(badge);
		});
		sidebar.appendChild(otherGrid);
	}

	// MAIN CONTENT
	// Personal projects
	const projectsTitle = document.createElement("h2");
	projectsTitle.textContent = "Projets Personnels";
	main.appendChild(projectsTitle);
	const projects = document.createElement("ul");
	projects.id = "projects";

	// placeholder where selected GitHub repos will be injected
	const ghReposContainer = document.createElement('div');
	ghReposContainer.id = 'github-repos';
	main.appendChild(ghReposContainer);

	// load and render specific GitHub repos (hardcoded username inside function)
	loadSelectedRepos().catch(err => console.warn('Failed to load selected repos', err));

	const experiences = document.createElement("div");
	experiences.id = "experiences";
	const expTitle = document.createElement("h2");
	expTitle.textContent = "Expériences Professionnelles";
	experiences.appendChild(expTitle);

	const experiencesGrid = document.createElement("div");
	experiencesGrid.className = "experiences-grid";

	profilData.professionalExperiences.forEach(exp => {
		const expItem = document.createElement("div");
		expItem.className = "experience-item";
		const header = document.createElement("div");
		header.innerHTML = `<strong>${exp.position}</strong> chez <em>${exp.company}</em> (${exp.duration})`;
		expItem.appendChild(header);
		if (Array.isArray(exp.missions) && exp.missions.length) {
			const missionsList = document.createElement("ul");
			missionsList.className = "missions-list";
			exp.missions.forEach(mission => {
				const li = document.createElement("li");
				li.textContent = mission;
				missionsList.appendChild(li);
			});
			expItem.appendChild(missionsList);
		}
		experiencesGrid.appendChild(expItem);
	});
	experiences.appendChild(experiencesGrid);
	main.appendChild(experiences);

	const formations = document.createElement("div");
	formations.id = "formations";
	const formTitle = document.createElement("h2");
	formTitle.textContent = "Formations";
	formations.appendChild(formTitle);

	const formationsGrid = document.createElement("div");
	formationsGrid.className = "formations-grid";

	profilData.formations.forEach(form => {
		const formItem = document.createElement("div");
		formItem.className = "formation-item";
		formItem.innerHTML = `<strong>${form.degree}</strong> à <em>${form.school}</em> (${form.duration})`;
		formationsGrid.appendChild(formItem);
	});
	formations.appendChild(formationsGrid);
	main.appendChild(formations);
}

// start the app: fetch data and render
loadDataAndRender();

// Theme toggle: initialize from localStorage and wire the button
function applyTheme(theme) {
	if (!theme) return;
	document.documentElement.setAttribute('data-theme', theme);
}

function initTheme() {
	const saved = localStorage.getItem('theme');
	const initial = saved || 'light';
	applyTheme(initial);

	const btn = document.getElementById('theme-toggle');
	if (!btn) return;
	btn.addEventListener('click', () => {
		const current = document.documentElement.getAttribute('data-theme') || 'light';
		const next = current === 'light' ? 'dark' : 'light';
		applyTheme(next);
		localStorage.setItem('theme', next);
	});
}

// run immediately so page renders with correct theme
initTheme();

// Print PDF button handler
function initPrintButton() {
	const printBtn = document.getElementById('print-pdf-btn');
	if (!printBtn) return;

	printBtn.addEventListener('click', () => {
		// Save current theme
		const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';

		// Force light theme for printing
		document.documentElement.setAttribute('data-theme', 'light');

		// Wait a bit for the theme to apply, then print
		setTimeout(() => {
			window.print();

			// Restore original theme after print dialog closes
			// Listen for when print dialog is closed
			const afterPrint = () => {
				document.documentElement.setAttribute('data-theme', currentTheme);
				window.removeEventListener('afterprint', afterPrint);
			};
			window.addEventListener('afterprint', afterPrint);
		}, 100);
	});
}

// Initialize print button when page loads
initPrintButton();

// Force light theme when printing (even with Ctrl+P)
let savedThemeBeforePrint = null;

window.addEventListener('beforeprint', () => {
	// Save current theme
	savedThemeBeforePrint = document.documentElement.getAttribute('data-theme') || 'light';
	// Force light theme
	document.documentElement.setAttribute('data-theme', 'light');
});

window.addEventListener('afterprint', () => {
	// Restore original theme
	if (savedThemeBeforePrint) {
		document.documentElement.setAttribute('data-theme', savedThemeBeforePrint);
		savedThemeBeforePrint = null;
	}
});
