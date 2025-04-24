// get the canvas element
const canvas = document.getElementById("canvas");
// fetch data from the JSON file
fetch("./position1.json")
  .then((response) => response.json())
  .then((data) => {
    const { points } = data;
    console.log(points);

    points.forEach(createCard);
  });

function applyTransform(el, x, y, rotation) {
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad),
    sin = Math.sin(rad);
  // matrix(a, b, c, d, tx, ty)
  const matrix = [cos, sin, -sin, cos, x, y];
  el.style.transform = `matrix(${matrix.join(",")})`;
}

// function to create a card element
// and append it to the canvas
function createCard(obj) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = obj.arucoId;
  card.dataset.x = obj.screenPosition.x;
  card.dataset.y = obj.screenPosition.y;
  card.dataset.rotation = obj.rotation.angle;

  card.innerHTML = `
      <strong>ID:</strong> ${obj.arucoId}<br>
      <strong>Pos:</strong> x=${parseFloat(obj.position.x).toFixed(
        2
      )}, y=${parseFloat(obj.position.y).toFixed(2)}<br>
      <strong>Rot:</strong> ${parseFloat(obj.rotation.angle).toFixed(2)} rad
    `;

  positionCard(
    card,
    parseFloat(obj.screenPosition.x),
    parseFloat(obj.screenPosition.y),
    parseFloat(obj.rotation.angle)
  );
  enableDragging(card, obj);
  canvas.appendChild(card);
}
// function to position the card element
// based on the x and y coordinates
function positionCard(card, x, y, rotation) {
  card.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}rad)`;
}

// function to update the card element
// when the position changes
function updateCardDetails(card, obj) {
  const newX = parseFloat(card.dataset.x);
  const newY = parseFloat(card.dataset.y);
  const newRotation = parseFloat(card.dataset.rotation);

  card.innerHTML = `
      <strong>ID:</strong> ${obj.arucoId}<br>
      <strong>Pos:</strong> x=${newX.toFixed(2)}, y=${newY.toFixed(2)}<br>
      <strong>Rot:</strong> ${newRotation.toFixed(2)} rad
    `;
}

// function to enable dragging of the card element
// by adding event listeners for mousedown, mousemove, and mouseup events
function enableDragging(card, obj) {
  let startX, startY, origX, origY, startRotation, origRotation;

  card.addEventListener("mousedown", (e) => {
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    origX = parseFloat(card.dataset.x);
    origY = parseFloat(card.dataset.y);
    startRotation = parseFloat(card.dataset.rotation);
    origRotation = startRotation;

    function onMouseMove(e) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const newX = origX + dx;
      const newY = origY + dy;

      // Rotation adjustment based on mouse movement (optional)
    //   const angleChange = (dx + dy) * 0.01;
    //   const newRotation = origRotation + angleChange;

      card.dataset.x = newX;
      card.dataset.y = newY;
    //   card.dataset.rotation = newRotation;

      positionCard(card, newX, newY, origRotation);
      updateCardDetails(card, obj); // Update card details dynamically
    }

    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });
}
