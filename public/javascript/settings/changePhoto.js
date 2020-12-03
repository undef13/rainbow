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
    onCloseButtonClick();
  });

  // Submit Button Click
  $("#formPhotoButton").on("click", () => {
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
        onCloseButtonClick();
        $("#displayPhotoForm").modal("hide");
      },
    });
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
          onLoadChangeDOM();
        };
        reader.readAsDataURL(file);
      }
    } else {
      $("#displayPhotoForm").modal("hide");
      alert(false, "Only files with jpeg, jpg and png format are accepted");
    }
  };

  const onLoadChangeDOM = () => {
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

  const onCloseButtonClick = () => {
    $("#image-container").attr("hidden", true);
    $("#image-uploaded").attr("src", null);
    dropZone.attr("hidden", false);
    $("#formPhotoButton").prop("disabled", true);
    if (cropper !== undefined) {
      cropper.destroy();
    }
  };
});

// $(document).ready(function () {
//   let cropper;
//   let isPhoto = false;
//   const image = document.getElementById("photo-uploaded");
// //   const uploadButton = document.getElementById("formPhotoButton");

//   const readURL = (input) => {
//     if (input.files && input.files[0]) {
//       const reader = new FileReader();

//       reader.onload = (e) => {
//         $("#photo-uploaded").attr("src", e.target.result);
//         console.log(e.target.result);
//         cropper = new Cropper(image, {
//           aspectRatio: 1,
//           viewMode: 3,
//         });
//       };

//       reader.readAsDataURL(input.files[0]);
//     }
//   };

//   $(".input-photo").on("change", function () {
//     readURL(this);
//   });

//   $("#modal-photo-wrapper").on("click", () => {
//       $(".input-photo").click();
//   });

//   $("#closeFormPhoto").on("click", () => {
//     // isPhoto = false;
//     // if (cropper !== undefined) {
//     //   cropper.destroy();
//     // }

//     // $("#photo-uploaded").removeAttr("src")
//     // $("#photo-uploaded").attr("hidden", true);
//   });

//   $("#formPhotoButton").on("click", () => {
//     const canvas = cropper.getCroppedCanvas({
//       width: 400,
//       height: 400,
//     });

//     $.ajax({
//       url: "/settings/upload-photo",
//       method: "POST",
//       data: {
//         imageEncoded: canvas.toDataURL(),
//       },
//       success: (data) => {
//         console.log(data);
//       },
//     });

//     // canvas.toBlob((blob) => {
//     //   const url = URL.createObjectURL(blob);
//     //   const reader = new FileReader();
//     //   reader.readAsDataURL(blob);
//     //   reader.onloadend = () => {
//     //     const base64data = reader.result;
//     //     $.ajax({
//     //       url: "/settings/upload-photo",
//     //       method: "POST",
//     //       data: { imageEncoded: base64data },
//     //       success: (data) => {
//     //         $("#photoForm").modal("hide");
//     //         // $('#uploaded_image').attr('src', data);
//     //       },
//     //     });
//     //   };
//     // });
//   });
// });
