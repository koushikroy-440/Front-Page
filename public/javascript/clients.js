//get country code
$(document).ready(function() {
    $("#country").on("input",async function(){
        let keyword = $(this).val().toLowerCase();
        const localData = checkInLs("countryCode");
        if(localData.isExist){
            const countries = localData.data;
            for(let country of countries){
                if(country.name.toLowerCase().indexOf(keyword) != -1) {
                  let dialCode = country.dial_code;
                  $("#code").html(dialCode);
                }
            }
        }else{
            let request = {
                type : "GET",
                url: "../json/country-code.json",
            }
            const response = await ajax(request);
            const countryData = JSON.stringify(response);
            localStorage.setItem("countryCode", countryData);
        }
        
    });
});

// request clients api for store data
$(document).ready(function(){
    $("#addClientForm").submit(async function(event){
        event.preventDefault();
        const token = getCookie("authToken");
        const formData = new FormData(this);
        formData.append("token", token);
        const request = {
            type: "POST",
            url: "/clients",
            data: formData,
            isLoader: true,
            commonBtn: ".add-client-submit",
            loaderBtn: ".add-client-loader"
        }
        try{
             await ajax(request);
             $("#clientModal").modal("hide");
        }catch(err) {
            $("#addClientEmail").addClass('animate__animated animate__shakeX text-danger');
            $("#addClientEmail").click(function(){
                $(this).removeClass('animate__animated animate__shakeX text-danger');
                $(this).val('');
            });
        }
    });
});



function checkInLs(key){
    if(localStorage.getItem(key) != null){
        let tmp = localStorage.getItem(key);
        const data = JSON.parse(tmp);
        return{
            isExist: true,
            data: data,
        }
    }else{
        return{
            isExist: false,
        }
    }
}

function ajax(request){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: request.type,
            url: request.url,
            data: request.type == 'GET' ? {} : request.data,
            processData: request.type == 'GET' ? true : false,
            contentType: request.type == 'GET' ? 'application/json' : false,
            beforeSend: function(){
                if(request.isLoader){
                    $(request.commonBtn).addClass('d-none');
                    $(request.loaderBtn).removeClass('d-none');
                }
            },
            success: function(response){
                if(request.isLoader){
                    $(request.commonBtn).removeClass('d-none');
                    $(request.loaderBtn).addClass('d-none');
                }
                resolve(response);
            },
            error: function(error){
                if(request.isLoader){
                    $(request.commonBtn).removeClass('d-none');
                    $(request.loaderBtn).addClass('d-none');
                }
                reject(error);
            }
        });
    })
   
}

function getCookie(cookieName){
    const allCookie = document.cookie;
    let cookies = allCookie.split(";");
    let cookieValue = "";
    for(let cookie of cookies){
        let currentCookie = cookie.split("=");
        if(currentCookie[0] == cookieName){
            cookieValue = currentCookie[1];
            break;
        }
    }
    return cookieValue;
}