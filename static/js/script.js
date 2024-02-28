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

      console.log("SAVE!!!");

      var moving_item_id = draggable[0].dataset.id;

      console.log(moving_item_id);

      var new_status = this.dataset.status;

      console.log(new_status);

      $.ajax({
        method: "POST",
        url: "{% url '/list/update-status/' %}",
        data: { id: moving_item_id, status: new_status },
        success: function (response) {
          // Håndter succesrespons fra serveren
          console.log("Status updated successfully");
        },
        error: function (xhr, status, error) {
          // Håndter fejl under AJAX-anmodningen
          console.error("Error:", error);
        },
      });
    },
  });
});
