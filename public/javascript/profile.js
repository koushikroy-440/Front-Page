// admin layout control
$(document).ready(function () {
  $(".toggler").click(function () {
    const state = $(".sidenav").hasClass("sidenav-open");
    if (state) {
      $(".sidenav").removeClass("sidenav-open");
      $(".sidenav").addClass("sidenav-close");

      // section control
      $(".section").removeClass("section-open");
      $(".section").addClass("section-close");
    }
    else {
      $(".sidenav").removeClass("sidenav-close");
      $(".sidenav").addClass("sidenav-open");

      // section control
      $(".section").removeClass("section-close");
      $(".section").addClass("section-open");
    }
  });
});

//show company info on client page
$(document).ready(function () {
  const token = getCookie("authToken");
  const company = decodeToken(token).data.companyInfo;
  $(".company-name").html(company.company_name);
  $(".company-email").html(company.email);
  $(".company-mobile").html(company.mobile);
});

//upload logo
$(document).ready(function () {
  $(".uploader").toast('show');
  $(".logo-box").click(function () {
    const ext = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp"
    ];
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async function () {
      const file = input.files[0];
      //show uploader
      $(".file-name").html(file.name);
      $(".uploader").removeClass('d-none');
      $(".uploader").addClass('animate__animated animated__slideInLeft');
      $(".uploader").toast('show');
      if (ext.indexOf(file.type) != -1) {
        const objectUrl = await uploadFileOnS3(file);
        $(".logo-box").html('');
        $(".logo-box").css({
          background: `url(${objectUrl})`,
          backgroundSize: 'cover',
        });
      } else {
        alert("upload a valid file");
      }
    }
  });
});