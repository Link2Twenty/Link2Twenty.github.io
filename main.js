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
  const card = document.createElement('div');
  card.classList.add('card');
  card.classList.add('social');
  // Link to post
  const link = document.createElement('a');
  link.setAttribute("target", "_blank");
  link.setAttribute("href", url);
  link.setAttribute("rel", "noreferrer");
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
  date.appendChild(document.createTextNode(published));
  link.appendChild(img);
  link.appendChild(head);
  link.appendChild(date);
  card.appendChild(link);

  return card;
}

getDevRSS('link2twenty').then(data => {
  const posts = xmlToJson(data).rss.channel.item.slice(0,3);
  const parent = document.querySelector('#blog');

  for (let post of posts) {
    const title = post.title['#text'];
    const published = new Date(post.pubDate['#text']);
    const url = post.link['#text'];

    parent.appendChild(makePostCard(title, published, url))
  }
})