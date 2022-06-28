$(document).ready(function () {
  showTasks()
})

async function showTasks() {
  $("table").html(`
      <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Task Description</th>
          <th>Date</th>
          <th>Current Status</th>
          
      </tr>
  `);
  const token = getCookie("authToken");
  const formData = new FormData();
  formData.append("token", token);
  const request = {
    type: "GET",
    url: "/teams/getAll",
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

function dynamicTr(task) {
  const tr = `
  <tr class="animate__animated animate__fadeIn">
  <td>
    ${task._id}
  </td>
  <td>
    ${task.name}
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
  
</tr>
  `
  return tr;
}