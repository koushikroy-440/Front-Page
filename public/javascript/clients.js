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
             const client = await ajax(request);
             $("#clientModal").modal("hide");
                dynamicTr(client.data);
                clientAction();
        }catch(err) {
            $("#addClientEmail").addClass('animate__animated animate__shakeX text-danger');
            $("#addClientEmail").click(function(){
                $(this).removeClass('animate__animated animate__shakeX text-danger');
                $(this).val('');
            });
        }
    });
});

//show clients
$(document).ready(function() {
    let from = 0;
    let to = 5;
    showClients(from, to);
})

async function showClients(from, to) {
    const request = {
        type: 'GET',
        url: `/clients/${from}/${to}`,
        isLoader: true,
        commonBtn: '.temp',
        loaderBtn: '.client-skeleton',
    }
    const response = await ajax(request);
    // console.log(response);
    if(response.data.length > 0) {
        for(let client of response.data) {
            const tr = dynamicTr(client);
        }
        clientAction();
    }else{
        alert('client not found');
    }
}

function dynamicTr(client) {
    let clientString = JSON.stringify(client);
    let clientData = clientString.replace(/"/g,"'");
    console.log(clientData);
    const tr = `
    <tr class='animate__animated animate__fadeIn'>
        <td>
            <div class='d-flex'>
                <i class='fa fa-user-circle mr-3' style='font-size: 45px'></i>
                <div>
                    <p class='p-0 m-0 text-capitalize'>${client.clientName}</p>
                    <small class='text-uppercase'>${client.clientCountry}</small>
                <div>
            </div>
        </td>
        <td>
            ${client.clientEmail}
        </td>

        <td>
            ${client.clientMobile}
        </td>
        <td>
            <span class='badge badge-danger'>offline</span>
        </td>
        <td>
            ${client.updatedAt}
        </td>
        <td>
            <div class='d-flex'>
                <button class='icon-btn-primary mr-3 edit-client' data-id='${client._id}' data-client='${clientData}'>
                    <i class='fa fa-edit'></i>
                </button>

                <button class='icon-btn-danger mr-3 delete-client' data-id='${client._id}'>
                    <i class='fa fa-trash'></i>
                </button>

                <button class='icon-btn-info mr-3 share-client' data-id='${client._id}'>
                    <i class='fa fa-share-alt'></i>
                </button>
            </div>
        </td>
    </tr>`;
    $(".table").append(tr);
    return tr;
}

function clientAction(){
    //delete clients
    $(document).ready(function(){
        $(".delete-client").each(function(){
            const tr = this.parentElement.parentElement.parentElement;
            $(this).click(async function(){
                const id = $(this).attr("data-id");
                const token = getCookie("authToken");
                const request = {
                    type: 'DELETE',
                    url: '/clients/' + id,
                    data: {
                        token : token,
                    }
                }
                const dataRes = await ajax(request);
                $(tr).removeClass('animate__animated animate__fadeIn');
                $(tr).addClass('animate__animated animate__fadeOut');
                setTimeout(() =>{
                    $(tr).remove();
                },500);
            });
        });
    });

    //edit client
    $(document).ready(function() {
        $(".edit-client").each(function() {
            $(this).click(function() {
                const id = $(this).attr('data-id');
                const clientString = $(this).data('client');
                clientString.replace(/'/g,'"');
                console.log(clientString);
                $("#clientModal").modal('show');
            });
        });
    });
}


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
        let option = {
            type: request.type,
            url: request.url,
            
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
        }

        if(request.type == 'POST' || request.type == 'PUT'){
            option['data'] = request.data;
            option['processData'] = false;
            option['contentType'] = false;
        }
        if(request.type == 'DELETE'){
            option['data'] = request.data;
        }
        $.ajax(option);
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