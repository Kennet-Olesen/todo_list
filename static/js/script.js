$(function () {
  $(".card").draggable({
    revert: true, // Hvis kortet ikke droppes på en droppable, går det tilbage til sin oprindelige position
    cursor: "move", // Cursor-udseende, når kortet trækkes
    zIndex: 1000, // Z-indekset for at sikre, at kortet er synligt, når det trækkes
    containment: "body", // Begræns trækningen af kortet til kroppen af ​​siden
  });

  $(".droppable").droppable({
    accept: ".card", // Angiv, hvilke elementer der kan slippes her (kun kort)
    drop: function (event, ui) {
      // Få det droppable element, der blev droppet ind i
      var droppable = $(this);
      // Få det draggable kort, der blev sluppet
      var draggable = ui.draggable;

      // Flyt det draggable kort ind i det droppable element
      draggable.appendTo(droppable);
    },
  });
});