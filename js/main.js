function getDevRSS(user) {
  return new Promise(function (resolve, reject) {
    const url = "https://dev.to/feed/" + user;
    var oReq = new XMLHttpRequest();
    // Resolve promise on load
    oReq.addEventListener("load", data => {
      resolve(data.target.responseXML)
    });
    // Reject promise on error
    oReq.addEventListener("error", err => {
      reject(err)
    });

    oReq.open("GET", url);
    oReq.send();
  })
}

// Get post information from xml and return as 
// array of objects
// xml: the xml response
// num: number of posts to be returned
function xmlToPost(xml, num) {
  const item = xml.getElementsByTagName('item');
  const array = [];
  for (let i = 0; i < num; i++) {
    array.push({
      "title": item[i].querySelector('title').textContent,
      "published": item[i].querySelector('pubDate').textContent,
      "url": item[i].querySelector('link').textContent
    });
  }
  return array;
}

// Returns element to be appended to the dom
function makePostCard(title, published, url) {
  // Whole card
  const card = document.createElement('a');
  card.classList.add('card');
  card.classList.add('social');
  card.setAttribute("target", "_blank");
  card.setAttribute("href", url);
  card.setAttribute("rel", "noreferrer");
  // Dev logo
  const img = document.createElement("img");
  img.setAttribute("src", "./images/devto.png");
  img.setAttribute("alt", "Blog's logo");
  // Post title
  const head = document.createElement("h3");
  head.classList.add('center');
  head.appendChild(document.createTextNode(title));
  const date = document.createElement("p");
  date.classList.add('date');
  date.classList.add('center');
  date.appendChild(document.createTextNode(published));
  card.appendChild(img);
  card.appendChild(head);
  card.appendChild(date);

  return card;
}

// Read the RSS field and append card to the blog
// section.
getDevRSS('link2twenty').then(data => {
  const posts = xmlToPost(data, 3);
  const parent = document.querySelector('#blog');

  for (let post of posts) {
    const title = post.title;
    const published = new Date(post.published).toLocaleString('en-gb', {
      weekday: 'short',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    const url = post.url;

    parent.appendChild(makePostCard(title, published, url))
  }
});

// Handle draw controls
const menuButt = document.querySelector('nav button.menu');
const menuDraw = document.querySelector('.slide_navigation');
const menuLink = menuDraw.querySelectorAll('.menu a');
const backdrop = menuDraw.querySelector('.backdrop');

menuButt.addEventListener('click', _ => {
  menuDraw.removeAttribute('aria-hidden');
});

for (let link of menuLink) {
  link.addEventListener('click', _ => {
    menuDraw.setAttribute('aria-hidden', "true");
  })
}

backdrop.addEventListener('click', _ => {
  menuDraw.setAttribute('aria-hidden', "true");
})

document.addEventListener('keyup', e => {
  if (e.keyCode == 27 && !menuDraw.hasAttribute('aria-hidden')) {
    menuDraw.setAttribute('aria-hidden', "true");
  }
})