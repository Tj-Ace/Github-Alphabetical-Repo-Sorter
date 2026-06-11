(function () {
  const HEADING_RE = /repositories?/i;
  const REPO_LINK_RE = /^\/[^/]+\/[^/]+$/;

  function normalizeName(text) {
    return text.replace(/\s+/g, " ").trim().toLocaleLowerCase();
  }

  function getRepoNameFromLink(link) {
    if (!link) return "";
    const href = link.getAttribute("href") || "";
    const match = href.match(/^\/([^/]+)\/([^/]+)$/);
    if (!match) return "";
    return decodeURIComponent(match[2]);
  }

  function getRepoLink(item) {
    const links = Array.from(item.querySelectorAll('a[href^="/"]'));
    return links.find((link) => REPO_LINK_RE.test(link.getAttribute("href") || "")) || null;
  }

  function getItemSortKey(item) {
    const link = getRepoLink(item);
    if (link) {
      const repoName = getRepoNameFromLink(link);
      if (repoName) return normalizeName(repoName);
    }

    const text = item.textContent || "";
    return normalizeName(text);
  }

  function isRepoItem(item) {
    if (!(item instanceof HTMLElement)) return false;
    const links = Array.from(item.querySelectorAll('a[href^="/"]'));
    return links.some((link) => REPO_LINK_RE.test(link.getAttribute("href") || ""));
  }

  function getCandidateItems(container) {
    const directChildren = Array.from(container.children).filter((child) =>
      child instanceof HTMLElement
    );

    const directRepoItems = directChildren.filter(isRepoItem);
    if (directRepoItems.length >= 2) return directRepoItems;

    const listItems = Array.from(container.querySelectorAll(":scope > li")).filter(isRepoItem);
    if (listItems.length >= 2) return listItems;

    const nestedItems = Array.from(container.querySelectorAll("li")).filter(isRepoItem);
    if (nestedItems.length >= 2) return nestedItems;

    return [];
  }

  function findRepositoryContainers() {
    const candidates = [];
    const seen = new Set();

    const headingSelectors = ["h1", "h2", "h3", "h4", "[role='heading']"];
    for (const selector of headingSelectors) {
      for (const heading of document.querySelectorAll(selector)) {
        const label = (heading.textContent || "").trim();
        if (!HEADING_RE.test(label)) continue;

        let container = heading.parentElement;
        for (let depth = 0; container && depth < 4; depth += 1) {
          if (getCandidateItems(container).length >= 2) break;
          container = container.parentElement;
        }

        container = container?.closest("section, aside, nav") || container || heading.parentElement;
        if (!container || seen.has(container)) continue;
        seen.add(container);
        candidates.push(container);
      }
    }

    return candidates;
  }

  function sortContainer(container) {
    if (!(container instanceof HTMLElement)) return false;

    const items = getCandidateItems(container);
    if (items.length < 2) return false;

    const sorted = [...items].sort((a, b) => {
      const aKey = getItemSortKey(a);
      const bKey = getItemSortKey(b);
      return aKey.localeCompare(bKey, undefined, { sensitivity: "base" });
    });

    const currentOrder = items.map((item) => getItemSortKey(item)).join("|");
    const sortedOrder = sorted.map((item) => getItemSortKey(item)).join("|");
    if (currentOrder === sortedOrder) return false;

    const parent = items[0].parentElement;
    if (!parent) return false;

    for (const item of sorted) {
      parent.appendChild(item);
    }

    return true;
  }

  function sortAllRepositoryLists() {
    let changed = false;
    for (const container of findRepositoryContainers()) {
      changed = sortContainer(container) || changed;
    }
    return changed;
  }

  let scheduled = false;
  function scheduleSort() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      sortAllRepositoryLists();
    });
  }

  const observer = new MutationObserver(() => {
    scheduleSort();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  scheduleSort();
})();
