import swal from "sweetalert2";

export function isApprovedControl(is_approved, path) {
  if (is_approved == 1 || is_approved == 0) {
    swal
      .fire({
        title: "Oppss...",
        text: "This form is already approved",
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "Ok, got it!",
        customClass: {
          confirmButton: "btn font-weight-bold btn-light-primary",
        },
      })
      .then(function () {
        window.location.href = path;
      });
    return true;
  }

  return false;
}
