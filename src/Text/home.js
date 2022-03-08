// Make the text element draggable.
$(document).ready(function () {
  $(function () {
    $("#theText").draggable({
      containment: "parent", // set draggable area. Ref: https://www.encodedna.com/jquery/limit-the-draggable-area-using-jquery-ui.htm
    });
  });
});

// Select image and show it.
let chooseImage = () => {
  document.getElementById("file").click();
};

let showImage = (fl) => {
  if (fl.files.length > 0) {
    let reader = new FileReader();

    reader.onload = function (e) {
      let img = new Image();

      img.onload = function () {
        if (this.width > screen.width || this.height > screen.height) {
          alert(
            "Please select a small image. The image width and height should be less than the screen width and height."
          );

          document.getElementById("theText").style.display = "none";
          document.getElementById("bt").style.display = "none";
          document.getElementById("textArea").style.display = "none";
          document.getElementById("myimage").src = "";
        } else {
          document.getElementById("theText").style.display = "block";
          document.getElementById("bt").style.display = "block";
          document.getElementById("textArea").style.display = "block";
        }
      };

      img.src = e.target.result; // actual image.
      document.getElementById("myimage").src = reader.result; // Add the image on the form.
    };
    reader.readAsDataURL(fl.files[0]);
  }
};

let textContainer;
let t = "sample text";

// Get the values that you have entered in the textarea and
// write it in the DIV over the image.

let writeText = (ele) => {
  t = ele.value;
  document.getElementById("theText").innerHTML = t.replace(/\n\r?/g, "<br />");
};

// Finally, save the image with text over it.
let saveImageWithText = () => {
  textContainer = document.getElementById("theText"); // The element with the text.

  // Create an image object.
  let img = new Image();
  img.src = document.getElementById("myimage").src;

  // Create a canvas object.
  let canvas = document.createElement("canvas");

  // Wait till the image is loaded.
  img.onload = function () {
    drawImage();
    downloadImage(img.src.replace(/^.*[\\\/]/, "")); // Download the processed image.
  };

  // Draw the image on the canvas.
  let drawImage = () => {
    let ctx = canvas.getContext("2d"); // Create canvas context.

    // Assign width and height.
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the image.
    ctx.drawImage(img, 0, 0);

    textContainer.style.border = 0;

    // Get the padding etc.
    let left = parseInt(window.getComputedStyle(textContainer).left);
    let right = textContainer.getBoundingClientRect().right;
    let top = parseInt(window.getComputedStyle(textContainer).top, 0);
    let center = textContainer.getBoundingClientRect().width / 2;

    let paddingTop = window
      .getComputedStyle(textContainer)
      .paddingTop.replace("px", "");
    let paddingLeft = window
      .getComputedStyle(textContainer)
      .paddingLeft.replace("px", "");
    let paddingRight = window
      .getComputedStyle(textContainer)
      .paddingRight.replace("px", "");

    // Get text alignement, colour and font of the text.
    let txtAlign = window.getComputedStyle(textContainer).textAlign;
    let color = window.getComputedStyle(textContainer).color;
    let fnt = window.getComputedStyle(textContainer).font;

    // Assign text properties to the context.
    ctx.font = fnt;
    ctx.fillStyle = color;
    ctx.textAlign = txtAlign;

    // Now, we need the coordinates of the text.
    let x; // coordinate.
    if (txtAlign === "right") {
      x = right + parseInt(paddingRight) - 11;
    }
    if (txtAlign === "left") {
      x = left + parseInt(paddingLeft);
    }
    if (txtAlign === "center") {
      x = center + left;
    }

    // Get the text (it can a word or a sentence) to write over the image.
    let str = t.replace(/\n\r?/g, "<br />").split("<br />");

    // finally, draw the text using Canvas fillText() method.
    for (let i = 0; i <= str.length - 1; i++) {
      ctx.fillText(
        str[i].replace("</div>", "").replace("<br>", "").replace(";", ""),
        x,
        parseInt(paddingTop, 10) + parseInt(top, 10) + 10 + i * 15
      );
    }

    // document.body.append(canvas);  // Show the image with the text on the Canvas.
  };
  // action text image


  function eventAssetsLoaded() {
    canvasApp();
  }
  // Download the processed image.
  let downloadImage = (img_name) => {
    let a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = img_name;
    document.body.appendChild(a);
    a.click();
  };
};
