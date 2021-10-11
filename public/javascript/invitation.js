$(document).ready(function () {
    const inv = getInvitation();
    $('.logo').attr('src', inv.logo);
    $('.company-name').html(inv.companyName);
    $('.email').html(inv.email);
});

function getInvitation() {
    const url = window.location.pathname;
    let array = url.split('/');
    let token = array[array.length - 1];
    const inv = decodeToken(token);
    inv.data['token'] = token;
    return inv.data;
}

$(document).ready(function () {
    $("form").submit(async function (e) {
        e.preventDefault();
        const inv = getInvitation();
        const formData = new FormData();
        formData.append("token", inv.token);
        const request = {
            type: "POST",
            url: "/clients/" + inv.clientId,
            data: formData
        }
        const response = await ajax(request);
        window.location = '/';
    });
});