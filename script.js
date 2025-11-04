async function loadDataAndRender() {
	try {
		const res = await fetch('./data.json');
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

	const title = document.createElement("h1");
	title.id = "title";
	title.textContent = "Curriculum Vitae";
	main.appendChild(title);

	const subtitle = document.createElement("h2");
	subtitle.id = "subtitle";
	subtitle.textContent = `${profilData.name} - ${profilData.post}`;
	main.appendChild(subtitle);

	const profile = document.createElement("div");
	profile.id = "profile";
	profile.textContent = `${profilData.profile}`;
	main.appendChild(profile);


	// left column: info
	const info = document.createElement("div");
	info.id = "info";
	info.textContent = `${profilData.info}`;

	if (profilData.github) {
		renderGitHubWidget(profilData.github, sidebar).catch(err => {
			console.warn('GitHub widget failed', err);
		});
	}

	sidebar.appendChild(info);


	const summary = document.createElement("div");
	summary.id = "summary";
	summary.textContent = `${profilData.summary}`;
	main.appendChild(summary);

	// Projets personnels
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

	const skillsTitle = document.createElement("h2");
	skillsTitle.textContent = "Compétences";
	main.appendChild(skillsTitle);
	const skills = document.createElement("ul");
	skills.id = "skills";
	profilData.skills.forEach(skill => {
		const skillItem = document.createElement("li");
		skillItem.textContent = skill;
		skills.appendChild(skillItem);
	});
	main.appendChild(skills);

	const experiences = document.createElement("div");
	experiences.id = "experiences";
	const expTitle = document.createElement("h2");
	expTitle.textContent = "Expériences Professionnelles";
	experiences.appendChild(expTitle);
	profilData.professionalExperiences.forEach(exp => {
		const expItem = document.createElement("div");
		expItem.className = "experience-item";
		expItem.innerHTML = `<strong>${exp.position}</strong> chez <em>${exp.company}</em> (${exp.duration})<br>${exp.description}`;
		experiences.appendChild(expItem);
	});
	main.appendChild(experiences);

	const formations = document.createElement("div");
	formations.id = "formations";
	const formTitle = document.createElement("h2");
	formTitle.textContent = "Formations";
	formations.appendChild(formTitle);
	profilData.formations.forEach(form => {
		const formItem = document.createElement("div");
		formItem.className = "formation-item";
		formItem.innerHTML = `<strong>${form.degree}</strong> à <em>${form.school}</em> (${form.duration})`;
		formations.appendChild(formItem);
	});
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
