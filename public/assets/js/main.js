//Join Group button
const joins = document.querySelectorAll("a.join");

joins.forEach((join) => {
  join.addEventListener("click", (e) => {
    const endpoint = `/groups/${join.dataset.doc}`;

    fetch(endpoint, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => (window.location.href = data.redirect))
      .catch((err) => console.log(err));
  });
});
//---------------------------------
