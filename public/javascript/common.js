const config = {
    accessKeyId: "AKIA2QE56KF5HU6JVWXU",
    secretAccessKey: "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",
    region: "ap-south-1",
    params: {
        Bucket: "docs.frontpage.koushikroy.org"
    }
}

const s3 = new AWS.S3(config);
function ajax(request) {
    return new Promise(function (resolve, reject) {
        let options = {
            type: request.type,
            url: request.url,
            beforeSend: function () {
                if (request.isLoader) {
                    $(request.commonBtn).addClass("d-none");
                    $(request.loaderBtn).removeClass("d-none");
                }
            },
            success: function (response) {
                if (request.isLoader) {
                    $(request.commonBtn).removeClass("d-none");
                    $(request.loaderBtn).addClass("d-none");
                }
                resolve(response);
            },
            error: function (error) {
                if (request.isLoader) {
                    $(request.commonBtn).removeClass("d-none");
                    $(request.loaderBtn).addClass("d-none");
                }
                reject(error);
            }
        }

        if (request.type == "POST" || request.type == "PUT") {
            options['data'] = request.data;
            options['processData'] = false;
            options['contentType'] = false;
        }

        if (request.type == "DELETE") {
            options['data'] = request.data;
        }

        $.ajax(options);
    });

}
//get cookie
function getCookie(cookieName) {
    const allCookie = document.cookie;
    let cookies = allCookie.split(";");
    let cookieValue = "";
    for (let cookie of cookies) {
        let currentCookie = cookie.split("=");
        if (currentCookie[0] == cookieName) {
            cookieValue = currentCookie[1];
            break;
        }
    }
    return cookieValue;
}


//formate date
function formatDate(dateString) {
    const date = new Date(dateString);
    let day = date.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    const year = date.getFullYear();
    //get timer
    const time = date.toLocaleTimeString();
    return day + "-" + month + "-" + year + " " + time;
}

//decode token
function decodeToken(token) {
    let playLoad = token.split(".")[1];
    let string = atob(playLoad);
    let dataObject = JSON.parse(string);
    return dataObject;
}

//upload file on AWS bucket
async function uploadFileOnS3(file) {
    const fileInfo = {
        Key: file.name,
        Body: file,
        ACL: "public-read"
    }
    try {
        const object = await s3.upload(fileInfo)
            .on("httpUploadProgress", (progress) => {
                let loaded = progress.loaded;
                let total = progress.total;
                let percentage = Math.floor((loaded * 100) / total);
                $(".progress-width").css({ width: percentage + "%" });
                $(".progress-text").html(percentage + "%");

                // calculate mb
                let totalMb = (total / 1024 / 1024).toFixed(1);
                let loadedMb = (loaded / 1024 / 1024).toFixed(1);
                $(".progress-in-mb").html(loadedMb + "Mb / " + totalMb + "Mb");
            })
            .promise();
        return object.Location;
    } catch (err) {
        return err;
    }
}

function ajaxDownloader(request) {
    return $.ajax({
        type: request.type,
        url: req.url,
        xhr: function () {
            const xml = new XMLHttpRequest();
            xml.responseType = 'blob';
            return xml;
        }
    }).promise();
}