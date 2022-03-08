var defaultRTE = new ej.richtexteditor.RichTextEditor({
  insertImageSettings: {
    saveUrl: "https://ej2.syncfusion.com/services/api/uploadbox/Save",
    removeUrl: "https://ej2.syncfusion.com/services/api/uploadbox/Remove",
  },
  toolbarSettings: {
    items: ["Image"],
  },
});
defaultRTE.appendTo("#defaultRTE");
