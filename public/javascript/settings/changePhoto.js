import { alert, makeAjax } from "../common/helper-functions.js";

document.addEventListener("DOMContentLoaded", function () {
  let cropper;
  const image = document.getElementById("image-uploaded");
	const displayPhotoModal = document.getElementById("displayPhotoModal");

	// Handler for pressing "Choose File"
	document.getElementById("file-input").addEventListener("change", function() {
		getBase64(this.files[0]);
	});

  // Drag & Drop
  const dropZone = document.getElementById("upload-container");
  
  ["drag", "dragstart", "dragend", "dragover", "dragenter", "dragleave", "drop"].forEach(eventName => {
		dropZone.addEventListener(eventName, (e) => {
			e.preventDefault();
			e.stopPropagation();
		});
	});

	dropZone.addEventListener("dragenter", () => {
		dropZone.classList.add("dragover");
	});

	dropZone.addEventListener("dragover", () => {
		dropZone.classList.add("dragover");
	});

  dropZone.addEventListener("dragleave", (e) => {
    let dx = e.pageX - dropZone.offsetLeft;
    let dy = e.pageY - dropZone.offsetTop;
    if (dx < 0 || dx > dropZone.width || dy < 0 || dy > dropZone.height) {
      dropZone.classList.remove("dragover");
    }
  });

  dropZone.addEventListener("drop", function (e) {
		dropZone.classList.remove("dragover");
    let file = e.dataTransfer.files[0];
    getBase64(file);
  });

  // Close Button click
  document.getElementById("closeFormPhoto").addEventListener("click", () => {
    onCloseModal();
  });

  // Submit Button Click
  document.getElementById("formPhotoButton").addEventListener("click", () => {
    onSubmitButtonClick();
  });

  // Get Base64 data
  const getBase64 = (file) => {
		const modal = bootstrap.Modal.getInstance(document.getElementById("displayPhotoModal"));
    if (file.type == "image/jpeg" || file.type == "image/png") {
      if (file.size > 3000000) {
				modal.hide();
        alert(false, "File size should be less then 3 mb");
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
					document.getElementById("image-uploaded").setAttribute("src", e.target.result);
          awakeUploadContainer();
        };
        reader.readAsDataURL(file);
      }
    } else {
      modal.hide();
      alert(false, "Only files with jpeg, jpg and png format are accepted");
    }
  };

  // Awake Upload Container
  const awakeUploadContainer = () => {
		dropZone.hidden = true;
		document.getElementById("image-container").hidden = false;
    document.getElementById("formPhotoButton").disabled = false;
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
		document.getElementById("image-container").hidden = true;
		document.getElementById("image-uploaded").setAttribute("src", "");
		document.getElementById("formPhotoButton").disabled = true;
		dropZone.hidden = false;
    if (cropper !== undefined) {
      cropper.destroy();
		}
		const modal = bootstrap.Modal.getInstance(document.getElementById("displayPhotoModal"));
		modal.hide();
  };

  // Submit button handler
  const onSubmitButtonClick = () => {
    const canvas = cropper.getCroppedCanvas({
      width: 400,
      height: 400,
		});
		ajaxAction("BEFORE_SEND");
		makeAjax("/settings/upload-photo", {
			imageEncoded: canvas.toDataURL()
		}).then(data => {
			document.getElementById("navigation-image").setAttribute("src", data.data.imageUrl);
			document.getElementById("dropdown-image").setAttribute("src", data.data.imageUrl);
      alert(data.isSuccessful, data.message);
			ajaxAction("AFTER_SEND");
		});
  };

const	ajaxAction = (action) => {
		switch(action) {
			case "BEFORE_SEND":
				displayPhotoModal.querySelectorAll("button").forEach(button => button.disabled = true);
				displayPhotoModal.querySelector(".spinner").hidden = false;
				displayPhotoModal.querySelector(".button-text").hidden = true;
				break;
			case "AFTER_SEND":
				displayPhotoModal.querySelectorAll("button").forEach(button => button.disabled = false);
				displayPhotoModal.querySelector(".spinner").hidden = true;
				displayPhotoModal.querySelector(".button-text").hidden = false;
    		onCloseModal();
				break;
		}
	}

//   const makeAjax = (canvas) => {
//     $.ajax({
//       url: "/settings/upload-photo",
//       method: "POST",
//       data: {
//         imageEncoded: canvas.toDataURL(),
//       },
//       beforeSend: ajaxBeforeSend,
//       success: (data) => {
//         $("#navigation-image").attr("src", data.data.imageUrl);
//         $("#dropdown-image").attr("src", data.data.imageUrl);
//         alert(data.isSuccessful, data.message);
//       },
//       complete: ajaxComplete,
//     });
//   }

//   const ajaxBeforeSend = () => {
//     $("#formPhotoButton, #closeFormPhoto").prop("disabled", true);
//     $(".spinner").prop("hidden", false);
//     $(".status-text").prop("hidden", true);
//   }

//   const ajaxComplete = () => {
//     $("#formPhotoButton, #closeFormPhoto").prop("disabled", false);
//     $(".spinner").prop("hidden", true);
//     $(".status-text").prop("hidden", false);
//     onCloseModal();
//   }
// });
});