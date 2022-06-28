$(document).ready(function () {
    showTasks()
})

async function showTasks() {
    $("table").html(`
        <tr>
            <th>Id</th>
            <th>Task Description</th>
            <th>Date</th>
            <th>Current Status</th>
            <th>Action</th>
        </tr>
    `);
    const token = getCookie("authToken");
    const formData = new FormData();
    formData.append("token", token);
    const request = {
        type: "GET",
        url: "/task",
        data: formData,
    }
    const response = await ajax(request);
    console.log(response.data);
    if (response.data.length > 0) {
        for (let task of response.data) {
            const tr = dynamicTr(task);
            $("table").append(tr);
        }
    } else {
        alert("No task found")
    }

}

// $(document).ready(function () {
//     $(".change-status").each(function () {
//         $(this).click(function () {
//             alert("sdhbubu");
//         })
//     })
// })

function dynamicTr(task) {
    const tr = `
    <tr class="animate__animated animate__fadeIn">
    <td>
      ${task._id}
    </td>
    <td class="client-email">
      ${task.taskDescription}
    </td>
    <td>
    ${formatDate(task.createdAt)}
    </td>
    <td>
        <span class="badge  ${task.status == "pending" ? 'badge-danger' : 'badge-success'} ">${task.status}</span>
    </td>
    <td>
        <button onClick="change('${task._id}')" class="icon-btn-warning change-status mr-3 ${task.status == "pending" ? '' : 'd-none'} " data-id="${task._id}" data-client="${task} ">
            <i class="fa fa-check-circle "></i>
        </button>
    </td>
  </tr>
    `
    return tr;
}

async function change(id) {
    const token = getCookie("authToken");
    const formData = new FormData();
    formData.append("token", token);
    formData.append("id", id)

    const request = {
        type: "PUT",
        url: "/task",
        data: formData
    }

    const response = await ajax(request);
    console.log(response);
    if (response.data.length > 0) {
        location.reload();
    } else {
        alert("No task found")
    }

}