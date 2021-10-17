//*redirect user if already logged 

if (document.cookie.indexOf("authToken") != -1) {
    window.location = "/clients";
}



//*request for login modal
$(document).ready(() => {
    $("#request-login-modal").click((e) => {
        e.preventDefault();
        $("#signUp-modal").modal('hide');
        $("#login-modal").modal('show');
    });
});

//*request for signup modal
$(document).ready(() => {
    $("#request-signup-modal").click((e) => {
        e.preventDefault();
        $("#login-modal").modal('hide');
        $("#signUp-modal").modal('show');
    });
});

//*signup request
$(document).ready(() => {
    $("#signUp-form").submit((e) => {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "api/signup",
            data: new FormData(e.target),
            processData: false,
            contentType: false,
            beforeSend: () => {
                $(".before-send").removeClass("d-none");
                $(".submit-btn").addClass("d-none");
            },
            success: (response) => {
                $(".before-send").addClass("d-none");
                $(".submit-btn").removeClass("d-none");
                if (response.isUserCreated) {
                    window.location = "/clients";
                }
            },
            error: (error) => {
                $(".before-send").addClass("d-none");
                $(".submit-btn").removeClass("d-none");
                if (error.status == 409) {
                    const errorRes = JSON.parse(error.responseJSON.text);
                    const message = errorRes.message;
                    const field = "." + message.field;
                    const label = message.label;
                    $(field).addClass("border border-danger");
                    $(field + "_err").html(label);
                    setTimeout(() => {
                        resetValidator(field)
                    }, 3000);

                } else {
                    alert("Internal server error");
                }
            }
        });
    });
});

//*enable and disable login button
$(document).ready(function () {
    $(".login-as").each(function () {
        $(this).on('change', function () {
            $(".login-btn").prop('disabled', false);
        });
    })
});

//*login request
$(document).ready(() => {
    $("#login-form").submit((e) => {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "api/login",
            data: new FormData(e.target),
            processData: false,
            contentType: false,
            beforeSend: () => {
                $(".before-send").removeClass("d-none");
                $(".login-btn").addClass("d-none");
            },
            success: (response) => {
                if (response.isLogged) {
                    window.location = "/clients";
                } else {
                    $(".company-password").addClass("border border-danger");
                    $(".password-err").html("incorrect password !")
                }
            },
            error: (error) => {
                console.log(error);

                // $(".before-send").addClass("d-none");
                // $(".login-btn").removeClass("d-none");

                // if (error.status == 404) {
                //     $(".username").addClass('border border-danger');
                //     $('.username-err').html('company not found !');
                // }
                // else if (error.status = 401) {
                //     $(".company-password").addClass("border border-danger");
                //     $(".password-err").html("incorrect password !")
                // }
                // else if (error.status = 406) {
                //     $(".company-password").addClass("border border-danger");
                //     $(".password-err").html("please logout from other device");
                // }
                // else {
                //     alert('some thing went wrong please try after sometime later');
                // }
            }
        });
    });
});


function resetValidator(field) {
    $(field).removeClass("border border-danger");
    $(field + "_err").html("");
}