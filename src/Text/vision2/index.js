// move and  text
canvas = new fabric.Canvas("design-canvas");

jQuery("#add-text-btn").click(function () {
  var message = $("textarea#add-text-value").val();

  var new_text = new fabric.Text(message, {
    left: 200,
    top: 200,
    fontSize: 20,
  });
  canvas.add(new_text);
  canvas.setActiveObject(canvas.item(canvas.getObjects().length - 1));
});

// image manage
var imageLoader = document.getElementById("imageLoader");
imageLoader.addEventListener("change", handleImage, false);
function handleImage(e) {
  var reader = new FileReader();
  reader.onload = function (event) {
    var img = new Image();
    img.onload = function () {
      var imgInstance = new fabric.Image(img, {
        scaleX: 0.2,
        scaleY: 0.2,
      });
      canvas.add(imgInstance);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
}
