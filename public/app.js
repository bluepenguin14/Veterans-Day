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

  if (!res.ok) {
    document.getElementById("message").innerHTML =
      data.error || "Unable to enter raffle.";
    return;
  }

  document.getElementById("message").innerHTML =
    `✅ Thank you <strong>${name}</strong>!<br>
     Your <strong>${tickets}</strong> ticket(s) have been entered into today's drawing.`;

  document.getElementById("name").value = "";
  document.getElementById("tickets").value = 1;
}
