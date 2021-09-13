//request for login modal
$(document).ready(()=>{
    $("#request-login-modal").click((e)=>{
        e.preventDefault();
        $("#signUp-modal").modal('hide');
        $("#login-modal").modal('show');
    });
});

//request for signup modal
$(document).ready(()=>{
    $("#request-signup-modal").click((e)=>{
        e.preventDefault();
        $("#login-modal").modal('hide');
        $("#signUp-modal").modal('show');
    });
});

//signup request
$(document).ready(()=>{
    $("#signUp-form").submit((e)=>{
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
            success: (response)=>{
                $(".before-send").addClass("d-none");
                $(".submit-btn").removeClass("d-none");
                const data = JSON.parse(response.text);
                
                if(data.isCompanyCreated){
                    //redirect user to profile page

                }
                else{
                    const field = "."+data.message.field;
                    const message = data.message.label;
                    $(field).addClass("border border-danger");
                    $(field+"_err").html(message);
                   setTimeout(() =>{
                    resetValidator(field)
                   },3000);
                }
            },
            error: (error)=>{
                console.log(error);
            }
        });
    });
});

//login request
$(document).ready(()=>{
    $("#login-form").submit((e)=>{
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
            success: (response)=>{
                if(response.isLogged){
                    window.location = "/profile";
                }
            },
            error: (error)=>{
                console.log(error);
            }
        });
    });
});


function resetValidator(field){
    $("filed").removeClass("border border-danger");
    $(field+"_err").html("");
}