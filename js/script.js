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
    renderPosts(allPosts);
  } catch (err) {
    statusEl.textContent = "";
    errorEl.textContent = "Erro ao carregar posts.";
    errorEl.classList.remove("hidden");
    console.error(err);
  }
}

function renderPosts(posts) {
  list.innerHTML = "";

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
