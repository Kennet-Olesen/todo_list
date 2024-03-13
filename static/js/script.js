$(function () {
  $(".card").draggable({
    revert: true,
    cursor: "move",
    zIndex: 1000,
    containment: "body",
  });

  $(".droppable").droppable({
    accept: ".card",
    drop: function (event, ui) {
      var droppable = $(this);
      var draggable = ui.draggable;
      var moving_item_id = draggable.data("id");
      console.log("moving_item_id:", moving_item_id); // Tilføj denne linje for fejlfinding
      var new_status = droppable.data("status");
      draggable.appendTo(droppable);
      console.log("SAVE!!!");

      console.log("DIT ID ER: ", moving_item_id);

      console.log(new_status);

      // AJAX-anmodning til at opdatere statussen for elementet
      $.ajax({
        method: "POST",
        url: "/list/update-status/",
        data: { id: moving_item_id, status: new_status },
        success: function (response) {
          // Handle success response from the server
          console.log("Status updated successfully");
          // Opdater baggrundsfarven baseret på den nye status
          if (new_status === "Done") {
            draggable.css("background-color", "lightgreen");
          } else {
            draggable.css("background-color", ""); // Tilbage til standard baggrundsfarve
          }
        },
        error: function (xhr, status, error) {
          // Handle error during AJAX request
          console.error("Error:", error);
          console.log("Status:", status);
          console.log("XHR:", xhr);
        },
      });
    },
  });
});
