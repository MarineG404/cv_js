async function loadSelectedRepos() {
	const username = "marineg404";
	const wantedRepos = ["Fokuz", "ADHDragon", "Stephagramme"];

	const container = document.getElementById('github-repos');
	if (!container) return;
	container.innerHTML = '';

	// Si la liste est vide, afficher un message
	if (wantedRepos.length === 0) {
		const emptyMsg = document.createElement('p');
		emptyMsg.textContent = 'Aucun projet sélectionné pour le moment.';
		emptyMsg.style.fontStyle = 'italic';
		emptyMsg.style.color = 'var(--muted)';
		container.appendChild(emptyMsg);
		return;
	}

	try {
		// Récupère TOUS les repos publics
		const response = await fetch(`https://api.github.com/users/${username}/repos`);
		if (!response.ok) {
			if (response.status === 403) {
				throw new Error('Limite de requêtes GitHub atteinte. Réessayez dans quelques minutes.');
			}
			throw new Error(`GitHub API ${response.status}`);
		}
		const repos = await response.json();

		// Filtre pour garder seulement ceux que tu veux
		const selected = repos.filter(repo => wantedRepos.includes(repo.name));

		// Si aucun repo trouvé, afficher un message
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
			desc.textContent = repo.description || 'Aucune description 😅';
			card.appendChild(desc);

			const stats = document.createElement('p');
			stats.textContent = `★ ${repo.stargazers_count} | Forks: ${repo.forks_count}`;
			card.appendChild(stats);

			const lang = document.createElement('p');
			const strong = document.createElement('strong');
			strong.textContent = 'Langage principal : ';
			lang.appendChild(strong);
			lang.insertAdjacentText('beforeend', `${repo.language || 'Non spécifié'}`);
			card.appendChild(lang);

			wrapper.appendChild(card);
		});

		container.appendChild(wrapper);
	} catch (err) {
		console.error('Failed to load GitHub repos', err);
		const errorMsg = document.createElement('p');
		errorMsg.textContent = err.message || 'Erreur lors du chargement des projets GitHub.';
		errorMsg.style.color = 'var(--accent)';
		errorMsg.style.fontStyle = 'italic';
		errorMsg.style.padding = '15px';
		errorMsg.style.textAlign = 'center';
		container.appendChild(errorMsg);
	}
}

// Fetch GitHub user data and render a small widget into `container`
async function renderGitHubWidget(username, container) {
	try {
		const resp = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
		if (!resp.ok) {
			if (resp.status === 403) {
				throw new Error('Limite de requêtes GitHub atteinte.');
			}
			throw new Error(`GitHub API ${resp.status}`);
		}
		const data = await resp.json();

		const widget = document.createElement('div');
		widget.className = 'gh-widget';

		// top row: avatar + meta
		const top = document.createElement('div');
		top.className = 'gh-top';

		const img = document.createElement('img');
		img.className = 'gh-avatar';
		img.src = data.avatar_url || '';
		img.alt = data.login || '';
		top.appendChild(img);

		const meta = document.createElement('div');
		meta.className = 'gh-meta';

		const nameDiv = document.createElement('div');
		nameDiv.className = 'gh-name';
		nameDiv.textContent = data.name || data.login || '';
		meta.appendChild(nameDiv);

		const link = document.createElement('a');
		link.href = data.html_url || '#';
		link.target = '_blank';
		link.rel = 'noopener';
		link.textContent = '@' + (data.login || '');
		meta.appendChild(link);

		top.appendChild(meta);
		widget.appendChild(top);

		// bio
		const bio = document.createElement('p');
		bio.className = 'gh-bio';
		bio.textContent = data.bio || '';
		widget.appendChild(bio);

		// stats
		const stats = document.createElement('div');
		stats.className = 'gh-stats';
		stats.textContent = `Repos: ${data.public_repos ?? 0} • Followers: ${data.followers ?? 0}`;
		widget.appendChild(stats);

		// insert at the end of the target container (inline)
		container.appendChild(widget);
	} catch (err) {
		console.warn('Could not load GitHub user', err);
		// Afficher un message d'erreur visible dans la sidebar
		const errorDiv = document.createElement('div');
		errorDiv.style.color = 'rgba(255, 255, 255, 0.7)';
		errorDiv.style.fontStyle = 'italic';
		errorDiv.style.fontSize = '0.9rem';
		errorDiv.style.padding = '10px';
		errorDiv.style.textAlign = 'center';
		errorDiv.textContent = err.message || 'Widget GitHub indisponible';
		container.appendChild(errorDiv);
	}
}
