const list = document.getElementById("list");
const statusEl = document.getElementById("status");
const errorEl = document.getElementById("error");
const searchEl = document.getElementById("q");
const userFilterEl = document.getElementById("userFilter");
const detailEl = document.getElementById("detail");

let allPosts = [];

document.addEventListener("DOMContentLoaded", init);

function init() {
  loadPosts();
  searchEl.addEventListener("input", () => {
    applyFilters();
  });

  userFilterEl.addEventListener("change", () => {
    applyFilters();
  });
}

async function loadPosts() {
  try {
    statusEl.textContent = "Carregando posts...";
    errorEl.classList.add("hidden");

    const response = await fetch("https://jsonplaceholder.typicode.com/posts");

    if (!response.ok) {
      throw new Error("Erro ao buscar posts");
    }

    const data = await response.json();
    allPosts = data;

    statusEl.textContent = "";
    applyFilters();
  } catch (err) {
    statusEl.textContent = "";
    errorEl.textContent = "Erro ao carregar posts.";
    errorEl.classList.remove("hidden");
    console.error(err);
  }
}

function renderPosts(posts) {
  list.innerHTML = "";

  if (posts.length === 0) {
    const p = document.createElement("div");
    p.textContent = "Nenhum post encontrado";
    list.appendChild(p);
    return;
  }

  posts.forEach((post) => {
      const div = document.createElement("div");
      div.classList.add("item");

      let resumo = post.body;
      if (post.body.length > 100) resumo = post.body.substring(0, 100) + "...";

      div.innerHTML = `
        <strong>${post.title}</strong>
        <p class="muted">${resumo}</p>
      `;

      div.addEventListener("click", () => {
      showDetail(post);
      });

      list.appendChild(div);
    });
}

function showDetail(post) {
  document.getElementById("dTitle").textContent = post.title;
  document.getElementById("dBody").textContent = post.body;
  document.getElementById("dMeta").textContent = `userId: ${post.userId} • postId: ${post.id}`;
  detailEl.classList.remove("hidden");
}

function filterByTitle(posts, term) {
  const t = term.trim().toLowerCase();
  if (t === "") {
    return posts;
  }

  return posts.filter(post => post.title.toLowerCase().includes(t));
}

function filterByUser(posts, userValue) {
  if (userValue === "all") {
    return posts;
  } else {
    return posts.filter(post => post.userId === Number(userValue));
  }
}

function applyFilters() {
  const userValue = userFilterEl.value;
  const searchTerm = searchEl.value;

  let result = allPosts;

  result = filterByUser(result,userValue);
  result = filterByTitle(result, searchTerm)

  renderPosts(result);
}
