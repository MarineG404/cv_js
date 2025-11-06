async function loadSelectedRepos() {
	const username = "marineg404";
	const wantedRepos = ["Fokuz", "ADHDragon", "Stephagramme"];

	const container = document.getElementById('github-repos');
	if (!container) return;
	container.innerHTML = '';

	// If list is empty, show a message
	if (wantedRepos.length === 0) {
		const emptyMsg = document.createElement('p');
		emptyMsg.textContent = 'Aucun projet sélectionné pour le moment.';
		emptyMsg.style.fontStyle = 'italic';
		emptyMsg.style.color = 'var(--muted)';
		container.appendChild(emptyMsg);
		return;
	}

	try {
		// Fetch ALL public repos
		const response = await fetch(`https://api.github.com/users/${username}/repos`);
		if (!response.ok) {
			if (response.status === 403) {
				throw new Error('GitHub request limit reached. Try again in a few minutes.');
			}
			throw new Error(`GitHub API ${response.status}`);
		}
		const repos = await response.json();

		// Filter to keep only the ones you want
		const selected = repos.filter(repo => wantedRepos.includes(repo.name));

		// If no repo found, show a message
		if (selected.length === 0) {
			const noRepoMsg = document.createElement('p');
			noRepoMsg.textContent = 'Les projets sélectionnés n\'ont pas été trouvés.';
			noRepoMsg.style.fontStyle = 'italic';
			noRepoMsg.style.color = 'var(--muted)';
			container.appendChild(noRepoMsg);
			return;
		}

		const wrapper = document.createElement('div');
		wrapper.className = 'selected-repos';

		selected.forEach(repo => {
			const card = document.createElement('div');
			card.className = 'selected-repo-card';

			const h3 = document.createElement('h3');
			const a = document.createElement('a');
			a.href = repo.html_url;
			a.target = '_blank';
			a.rel = 'noopener';
			a.textContent = repo.name;
			h3.appendChild(a);
			card.appendChild(h3);

			const desc = document.createElement('p');
			desc.textContent = repo.description || 'Aucune description';
			card.appendChild(desc);

			const stats = document.createElement('p');
			stats.textContent = `★ ${repo.stargazers_count} | Forks: ${repo.forks_count}`;
			card.appendChild(stats);

			const lang = document.createElement('p');
			lang.textContent = `Langage principal : ${repo.language || 'Non spécifié'}`;
			card.appendChild(lang);

			wrapper.appendChild(card);
		});

		container.appendChild(wrapper);
	} catch (err) {
		console.error('Failed to load GitHub repos', err);
		const errorMsg = document.createElement('p');
		errorMsg.textContent = err.message || 'Error loading GitHub projects.';
		errorMsg.style.color = 'var(--accent)';
		errorMsg.style.fontStyle = 'italic';
		errorMsg.style.padding = '15px';
		errorMsg.style.textAlign = 'center';
		container.appendChild(errorMsg);
	}
}
