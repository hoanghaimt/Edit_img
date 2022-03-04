const resizeableImage = (image_target) => {
  // defining the variables
  let constrain = false;

  const overlay = document.getElementById("overlay");
  const cropBtn = document.getElementById("js-crop");
  const container = document.getElementById("resize-container");
  const orig_src = new Image();
  const event_state = {};
  const min_width = 60;
  const min_height = 60;
  const max_width = 800;
  const max_height = 900;

  const resize_canvas = document.createElement("canvas");

  const resizeImage = (width, height) => {
    resize_canvas.width = width;
    resize_canvas.height = height;
    resize_canvas.getContext("2d").drawImage(orig_src, 0, 0, width, height);
    image_target.src = resize_canvas.toDataURL("image/jpg");
  };

  // the resizing function is where most of the action happens. This function is contansly invoked
  // while the user is dragging one of the resize handles. Every time this function is called we
  // work out the new with and height by taking the current position of the mouse relative to the
  // initial position of the corner we are dragging
  const resizing = (e) => {
    let width, height, left, top;

    const rec = container.getBoundingClientRect();
    const offset = {
      top: rec.top + window.scrollY,
      left: rec.left + window.scrollX,
    };
    const mouse = {
      x:
        (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) +
        window.screenLeft,
      y:
        (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) +
        window.screenTop,
    };

    const eTargetClass = event_state.evnt.target.classList[1];
    // if statements for being able to resize from each corner
    if (eTargetClass === "resize-handle-se") {
      // south-east (bottom-right)
      width = mouse.x - event_state.container_left;
      height = mouse.y - event_state.container_top;
      left = event_state.container_left;
      top = event_state.container_top;
    } else if (eTargetClass === "resize-handle-sw") {
      // south-west (bottom-left)
      width =
        event_state.container_width - (mouse.x - event_state.container_left);
      height = mouse.y - event_state.container_top;
      left = mouse.x;
      top = event_state.container_top;
    } else if (eTargetClass === "resize-handle-ne") {
      // north-east (top-right)
      width = mouse.x - event_state.container_left;
      height =
        event_state.container_height - (mouse.y - event_state.container_top);
      left = event_state.container_left;
      top = mouse.y;

      if (constrain || e.shiftKey) {
        top = mouse.y - ((width / orig_src.width) * orig_src.height - height);
      }
    } else if (eTargetClass === "resize-handle-nw") {
      // north-west (top-left)
      width =
        event_state.container_width - (mouse.x - event_state.container_left);
      height =
        event_state.container_height - (mouse.y - event_state.container_top);
      left = mouse.x;
      top = mouse.y;

      if (constrain || e.shiftKey) {
        top = mouse.y - ((width / orig_src.width) * orig_src.height - height);
      }
    }

    if (constrain || e.shiftKey) {
      height = (width / orig_src.width) * orig_src.height;
    }

    if (
      width > min_width &&
      height > min_height &&
      width < max_width &&
      height < max_height
    ) {
      container.style.top = `${top}px`;
      container.style.left = `${left}px`;
      resizeImage(width, height);
    }
  };

  // before we start tracking the mouse position we want to take
  // a snapshot of the container dimensions and other key data
  // points. We store these in a variable named event_state and
  // use them later as a point of reference while resizing to
  // work out the change in height and width
  const saveEventState = (e) => {
    event_state.container_width = container.getBoundingClientRect().width;
    event_state.container_height = container.getBoundingClientRect().height;
    event_state.container_left = container.offsetLeft;
    event_state.container_top = container.offsetTop;
    // mouse coordinates
    (event_state.mouse_x =
      (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) +
      window.screenLeft),
      (event_state.mouse_y =
        (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) +
        window.screenTop),
      (event_state.evnt = e);
  };

  // this two functions do very little other that tell the
  // browser to start paying attention to where the mouse
  // is moving and when to stop paying attention
  const startResize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    saveEventState(e);

    document.addEventListener("mousemove", resizing);
    document.addEventListener("mouseup", endResize);
  };

  const endResize = (e) => {
    e.preventDefault();
    //  The touchend event fires when one or more touch points are
    // removed from the touch surface.
    document.removeEventListener("mousemove", resizing);
    document.removeEventListener("touchend", resizing);
    document.removeEventListener("mouseup", endResize);
    document.removeEventListener("touchmove", endResize);
  };

  // in this function we need to work out the new position of the top left edge of the
  // container. This will be equal to the current position of the mouse, offset by the
  // distance the mouse was from the top left corner when we started dragging the image
  const moving = (e) => {
    const mouse = {
      x: (e.clientX || e.pageX) + window.screenLeft,
      y: (e.clientY || e.pageY) + window.screenTop,
    };

    container.style.left = `${
      mouse.x - (event_state.mouse_y - event_state.container_top)
    }px`;
    container.style.top = `${
      mouse.y - (event_state.mouse_y - event_state.container_top)
    }px`;
  };

  // function for moving the image around
  const startMoving = (e) => {
    e.preventDefault();
    e.stopPropagation();
    saveEventState(e);

    document.addEventListener("mousemove", moving);
    document.addEventListener("mouseup", endMoving);
  };

  const endMoving = (e) => {
    e.preventDefault();

    document.removeEventListener("mouseup", endMoving);
    document.removeEventListener("mousemove", moving);
  };

  const crop = (e) => {
    const left = overlay.offsetLeft - container.offsetLeft;
    const top = overlay.offsetTop - container.offsetTop;
    const width = overlay.getBoundingClientRect().width;
    const height = overlay.getBoundingClientRect().height;

    const crop_canvas = document.createElement("canvas");
    crop_canvas.width = width;
    crop_canvas.height = height;

    crop_canvas
      .getContext("2d")
      .drawImage(image_target, left, top, width, height, 0, 0, width, height);

    const croppedImage = document.createElement("img");
    croppedImage.src = crop_canvas.toDataURL("image/jpg");
    document.querySelector("#result").appendChild(croppedImage);
  };

  // this function is called immediately and makes a copy of the
  // original image used for resizing
  const init = () => {
    // create a new image with a copy of the original src
    // When resizing, we will always use this original copy
    // as the base
    orig_src.src = image_target.src;

    // add events
    container.addEventListener("mousedown", startResize);
    image_target.addEventListener("mousedown", startMoving);
    cropBtn.addEventListener("click", crop);
  };

  init();
};

// initializing the canvas and the target image
const image = document.getElementById("img");
resizeableImage(image);
