$(function () {
  $(".card").each(function () {
    var moving_item_id = $(this).data("id");
    var storedColor = localStorage.getItem("item_" + moving_item_id + "_color");
    if (storedColor) {
      $(this).css("background-color", storedColor);
    }
  });

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
      var new_status = droppable.data("status");
      draggable.appendTo(droppable);
      console.log("SAVE!!!");

      console.log("DIT ID ER: ", moving_item_id);

      console.log(new_status);

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
            // Gem den nye farve i localStorage
            localStorage.setItem(
              "item_" + moving_item_id + "_color",
              "lightgreen"
            );
          } else if (new_status === "InProgress") {
            draggable.css("background-color", "yellow");
            // Gem den nye farve i localStorage
            localStorage.setItem("item_" + moving_item_id + "_color", "yellow");
          } else if (new_status === "ToDo") {
            draggable.css("background-color", "lightblue");
            // Gem den nye farve i localStorage
            localStorage.setItem(
              "item_" + moving_item_id + "_color",
              "lightblue"
            );
          } else {
            draggable.css("background-color", ""); // Tilbage til standard baggrundsfarve
            // Fjern farveoplysningen fra localStorage
            localStorage.removeItem("item_" + moving_item_id + "_color");
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
