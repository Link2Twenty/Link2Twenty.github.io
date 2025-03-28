// Returns element to be appended to the dom
function makePostCard(title, published, url) {
  // Whole card
  const card = document.createElement("a");
  card.classList.add("card");
  card.classList.add("social");
  card.setAttribute("target", "_blank");
  card.setAttribute("href", url);
  card.setAttribute("rel", "noreferrer");
  // Dev logo
  const img = document.createElement("img");
  img.setAttribute("src", "./images/devto.webp");
  img.setAttribute("alt", "Blog's logo");
  // Post title
  const head = document.createElement("h3");
  head.classList.add("center");
  head.appendChild(document.createTextNode(title));
  const date = document.createElement("p");
  date.classList.add("date");
  date.classList.add("center");
  date.appendChild(document.createTextNode(published));
  card.appendChild(img);
  card.appendChild(head);
  card.appendChild(date);

  return card;
}

// Fetch blog posts
fetch('https://dev.to/api/articles?username=link2twenty&per_page=3').then((res) => res.json()).then((posts) => {
  const parent = document.querySelector("#blog");
  for (const post of posts) {
    const published = new Date(post.published_at).toLocaleString("en-gb", {
      weekday: "short",
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    parent.appendChild(makePostCard(post.title, published, post.url))
  }
});

// Handle draw controls
const menuButt = document.querySelector("nav button.menu");
const menuDraw = document.querySelector(".slide_navigation");
const menuLink = menuDraw.querySelectorAll(".menu a");
const backdrop = menuDraw.querySelector(".backdrop");

const navBar = document.querySelector("nav");
const header = document.querySelector("header");
const mainCo = document.querySelector("#main_body");
const footer = document.querySelector("footer");

function hideMenu() {
  menuDraw.setAttribute("inert", "");
  navBar.removeAttribute("inert");
  header.removeAttribute("inert");
  mainCo.removeAttribute("inert");
  footer.removeAttribute("inert");
}

function showMenu() {
  menuDraw.removeAttribute("inert");
  navBar.setAttribute("inert", "");
  header.setAttribute("inert", "");
  mainCo.setAttribute("inert", "");
  footer.setAttribute("inert", "");
}

menuButt.addEventListener("click", showMenu);

for (let i = 0; i < menuLink.length; i++) {
  menuLink[i].addEventListener("click", hideMenu);
}

backdrop.addEventListener("click", hideMenu)

document.addEventListener("keyup", function (e) {
  if (e.key === "Escape" && !menuDraw.hasAttribute("inert")) hideMenu();
})
