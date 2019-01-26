function getDevRSS(user) {
  return new Promise(function (resolve, reject) {
    const url = "https://dev.to/feed/" + user;
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", data => {
      resolve(data.target.responseXML)
    });
    oReq.addEventListener("load", err => {
      reject(err)
    });
    oReq.addEventListener("abort", err => {
      reject(err)
    });
    oReq.open("GET", url);
    oReq.send();
  })
}

// Changes XML to JSON
// https://davidwalsh.name/convert-xml-json
function xmlToJson(xml) {

  // Create the return object
  var obj = {};

  if (xml.nodeType == 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) { // text
    obj = xml.nodeValue;
  }

  // do children
  if (xml.hasChildNodes()) {
    for (var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof (obj[nodeName]) == "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof (obj[nodeName].push) == "undefined") {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
};

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

getDevRSS('link2twenty').then(data => {
  const posts = xmlToJson(data).rss.channel.item.slice(0, 3);
  const parent = document.querySelector('#blog');

  for (let post of posts) {
    const title = post.title['#text'];
    const published = new Date(post.pubDate['#text']).toLocaleString('en-gb', {
      weekday: 'short',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    const url = post.link['#text'];

    parent.appendChild(makePostCard(title, published, url))
  }
});

const menuButt = document.querySelector('nav button.menu');
const menuDraw = document.querySelector('.slide_navigation');
const menuLink = menuDraw.querySelectorAll('.menu a');
const backdrop = menuDraw.querySelector('.backdrop');

menuButt.addEventListener('click', _ => {
  menuDraw.removeAttribute('aria-hidden');
});

for (let link of menuLink) {
  link.addEventListener('click', _ => {
    menuDraw.setAttribute('aria-hidden', "");
  })
}

backdrop.addEventListener('click', _ => {
  menuDraw.setAttribute('aria-hidden', "");
})

backdrop.addEventListener('click', _ => {
  menuDraw.setAttribute('aria-hidden', "");
})

document.addEventListener('keyup', e => {
  if (e.keyCode == 27 && !menuDraw.hasAttribute('aria-hidden')) {
    menuDraw.setAttribute('aria-hidden', "");
  }
})