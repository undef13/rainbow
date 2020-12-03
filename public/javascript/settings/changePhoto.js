import { alert } from "../common/helper-functions.js";

$(document).ready(function () {
  let cropper;
  const image = document.getElementById("image-uploaded");

  // Handler for pressing "Choose File"
  $("#file-input").on("change", function () {
    getBase64(this.files[0]);
  });

  // Drag & Drop
  const dropZone = $("#upload-container");

  dropZone.on(
    "drag dragstart dragend dragover dragenter dragleave drop",
    () => {
      return false;
    }
  );

  dropZone.on("dragenter dragover", () => {
    dropZone.addClass("dragover");
  });

  dropZone.on("dragleave", (e) => {
    let dx = e.pageX - dropZone.offset().left;
    let dy = e.pageY - dropZone.offset().top;
    if (dx < 0 || dx > dropZone.width() || dy < 0 || dy > dropZone.height()) {
      dropZone.removeClass("dragover");
    }
  });

  dropZone.on("drop", function (e) {
    dropZone.removeClass("dragover");
    let file = e.originalEvent.dataTransfer.files[0];
    getBase64(file);
  });

  // Close Button click
  $("#closeFormPhoto").on("click", () => {
    onCloseModal();
  });

  // Submit Button Click
  $("#formPhotoButton").on("click", () => {
    onSubmitButtonClick();
  });

  // Get Base64 data
  const getBase64 = (file) => {
    if (file.type == "image/jpeg" || file.type == "image/png") {
      if (file.size > 3000000) {
        $("#displayPhotoForm").modal("hide");
        alert(false, "File size should be less then 3 mb");
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          $("#image-uploaded").attr("src", e.target.result);
          awakeUploadContainer();
        };
        reader.readAsDataURL(file);
      }
    } else {
      $("#displayPhotoForm").modal("hide");
      alert(false, "Only files with jpeg, jpg and png format are accepted");
    }
  };

  // Awake Upload Container
  const awakeUploadContainer = () => {
    dropZone.attr("hidden", true);
    $("#image-container").attr("hidden", false);
    $("#formPhotoButton").prop("disabled", false);
    cropper = new Cropper(image, {
      aspectRatio: 1,
      viewMode: 3,
      zoomable: false,
      minCropBoxWidth: 200,
      minCropBoxHeight: 200,
    });
  };

  // Close button handler
  const onCloseModal = () => {
    $("#image-container").attr("hidden", true);
    $("#image-uploaded").attr("src", null);
    $("#formPhotoButton").prop("disabled", true);
    dropZone.attr("hidden", false);
    if (cropper !== undefined) {
      cropper.destroy();
    }
  };

  // Submit button handler
  const onSubmitButtonClick = () => {
    const canvas = cropper.getCroppedCanvas({
      width: 400,
      height: 400,
    });

    $.ajax({
      url: "/settings/upload-photo",
      method: "POST",
      data: {
        imageEncoded: canvas.toDataURL(),
      },
      beforeSend: () => {
        $("#formPhotoButton, #closeFormPhoto").prop("disabled", true);
        $(".spinner").prop("hidden", false);
        $(".status-text").prop("hidden", true);
      },
      success: (data) => {
        $("#navigation-image").attr("src", data.data.imageUrl);
        $("#dropdown-image").attr("src", data.data.imageUrl);
        alert(data.isSuccessful, data.message);
      },
      complete: () => {
        $("#formPhotoButton, #closeFormPhoto").prop("disabled", false);
        $(".spinner").prop("hidden", true);
        $(".status-text").prop("hidden", false);
        onCloseModal();
        $("#displayPhotoForm").modal("hide");
      },
    });
  };
});
