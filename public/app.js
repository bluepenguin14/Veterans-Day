async function enterRaffle() {
const name =
  document.getElementById("name").value;

const tickets =
  parseInt(
    document.getElementById("tickets").value
  ) || 1;

  const res = await fetch("/api/enter", {
    method: "POST",
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
  name,
  tickets
})
  });

  const data = await res.json();

  document.getElementById("msg").innerText =
    data.success
      ? "Entry Accepted!"
      : data.error;
}
