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

// request /clients api for store data
$(document).ready(function(){
    $("#addClientForm").submit(async function(event){
        event.preventDefault();
        const request = {
            type: "POST",
            url: "/clients",
            data: new FormData(this)
        }
        const response = await ajax(request);
        console.log(response);
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
            success: function(response){
                resolve(response);
            },
            error: function(error){
                reject(error);
            }
        });
    })
   
}