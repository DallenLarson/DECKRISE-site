// inject-header.js
fetch("header.html")
  .then(res => res.text())
  .then(html => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    document.body.insertBefore(wrapper, document.body.firstChild);
  });

