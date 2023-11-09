function getUserName() {
    let username = localStorage.getItem('username')
    // $.ajax({
    //     url: "http://222.20.105.189:80/user/info",
    //     type: "GET",
    //     dataType: "json",
    //     async: false,
    //     success: function (data) {
    //         if (data.status === 1)
    //             console.log('get username error')
    //         else {
    //             username = data.username
    //         }
    //     }
    // });
    return username
}

function addTaskSubmit() {
    let username = getUserName()
    let task_name = document.getElementById('input-task-name').value;
    let start_time0 = new Date(document.getElementById('input-start-time').value);
    let end_time0 = new Date(document.getElementById('input-end-time').value);
    let remark = document.getElementById('input-remark').value

    if (task_name === '') {
        alert('请输入事项名称')
        return
    }
    if (start_time0 === '' || end_time0 === '' || start_time0 >= end_time0) {
        alert('时间输入有误')
        return
    }
    let start_time = start_time0.toLocaleString()
    let end_time = end_time0.toLocaleString()
    $.ajax({
        url: "http://222.20.105.189:80/task/addTask",
        data: { username, task_name, start_time, end_time, remark },
        type: "POST",
        dataType: "json",
        success: function (data) {
            if (data.status === 1) {
                alert(data.message)
            }
            else {
                alert('add task success')
                location.reload()
            }
        }
    });
}

function cancelAddTask() {
    $('input').val('')
    $('textarea').val('')
}

function showTaskTable() {
    // 获取用户的所有事项信息
    console.log('showTaskTable begin');
    let tasks = []
    let username = getUserName()
    console.log(username);
    $.ajax({
        url: "http://222.20.105.189:80/task/getTask",
        data: { username },
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.status === 1) {
                alert(data.message)
            }
            else {
                tasks = data.tasks
            }
        }
    })

    // 将事项信息转换为表格数据
    const tableData = tasks.map((task) => ({
        id: task.task_id,
        task_name: task.task_name,
        start_time: moment(task.start_time),
        end_time: moment(task.end_time),
        remark: task.remark,
        is_done: task.is_done
    }));



    // 设置表格的每页显示的条数
    const pageSize = 5;

    // 计算表格总页数
    const totalPages = Math.ceil(tableData.length / pageSize);

    // 创建表格
    const table = document.getElementById("listTable");
    console.log(table);
    // 添加表头
    const thead = document.createElement("thead");
    const tr = thead.insertRow();
    tr.insertCell().textContent = "事项ID";
    tr.insertCell().textContent = "事项名称";
    tr.insertCell().textContent = "开始时间";
    tr.insertCell().textContent = "结束时间";
    tr.insertCell().textContent = "备注";
    tr.insertCell().textContent = "是否已完成";
    tr.insertCell().textContent = ''
    tr.insertCell().textContent = ''

    table.appendChild(thead);
    // 添加表格数据
    const tbody = document.createElement('tbody')
    table.appendChild(tbody)

    for (const task of tableData) {
        const tr = tbody.insertRow();
        tr.insertCell().textContent = task.id;
        tr.insertCell().textContent = task.task_name;
        tr.insertCell().textContent = task.start_time.format("YYYY-MM-DD HH:mm");
        tr.insertCell().textContent = task.end_time.format("YYYY-MM-DD HH:mm");
        tr.insertCell().textContent = task.remark;
        tr.insertCell().textContent = task.is_done ? '已完成' : '未完成';

        // 插入 edit 按钮
        const editButton = document.createElement("button");
        editButton.textContent = "编辑";
        editButton.classList.add("edit");
        editButton.setAttribute('data-toggle', 'modal')
        editButton.setAttribute('data-target', '#editModal')
        editButton.onclick = editButtonFunc;
        tr.appendChild(editButton);
        // 插入 delete 按钮
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "删除";
        deleteButton.classList.add("delete");
        deleteButton.setAttribute('data-toggle', 'modal')
        deleteButton.setAttribute('data-target', '#deleteModal')
        deleteButton.onclick = deleteButtonFunc;
        tr.appendChild(deleteButton);

    }
    
    let currentPage = 1; // 设置一个全局变量来跟踪当前页

    // 函数来更新激活状态
    function setActivePage(selectedPage) {
        // 获取所有的分页器li元素
    const pageItems = document.querySelectorAll('.pagination li');
        // 移除active类
    pageItems.forEach(pageItem => pageItem.classList.remove('active'));
        // 为选中的页码添加active类
        pageItems[selectedPage - 1].classList.add('active');
    }
    document.addEventListener('DOMContentLoaded', function() {
        // 初始化页面，渲染第一页
        renderPage(1);
    });
    // 函数来渲染表格和分页器
    function renderPage(selectedPage) {
        // 更新当前页全局变量
        currentPage = selectedPage;
        // 调用渲染表格的函数
        renderTable(tableData, pageSize, currentPage - 1);
        // 设置激活的页码
        setActivePage(currentPage);
    }

    // 函数来创建分页器
    function createPagination(totalPages, currentPage) {
        const ul = document.createElement("ul");
        ul.classList.add("pagination");

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = `#`;
            a.textContent = i;

            if (i === currentPage) {
                li.classList.add("active");
            }

            a.addEventListener("click", function(event) {
                event.preventDefault();
                // 调用渲染页面函数
                renderPage(parseInt(this.textContent, 10));
            });

            li.appendChild(a);
            ul.appendChild(li);
        }

        return ul;
    }

    // 添加翻页按钮到页面
    const pageContentDiv = document.querySelector('.col-md-12');
    pageContentDiv.appendChild(createPagination(totalPages, currentPage));


    // 渲染表格
    function renderTable(tableData, pageSize, currentPage) {
        // 清除表格中的数据
        console.log();
        tbody.innerHTML = ''

        // 获取当前页的数据
        const pageItems = tableData.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

        // 添加表格数据
        for (const task of pageItems) {
            const tr = tbody.insertRow();
            tr.insertCell().textContent = task.id;
            tr.insertCell().textContent = task.task_name;
            tr.insertCell().textContent = task.start_time.format("YYYY-MM-DD HH:mm");
            tr.insertCell().textContent = task.end_time.format("YYYY-MM-DD HH:mm");
            tr.insertCell().textContent = task.remark;
            tr.insertCell().textContent = task.is_done ? '已完成' : '未完成';
            // 插入 edit 按钮
            const editButton = document.createElement("button");
            editButton.textContent = "编辑";
            editButton.classList.add("edit");
            editButton.setAttribute('data-toggle', 'modal')
            editButton.setAttribute('data-target', '#editModal')
            editButton.onclick = editButtonFunc;
            tr.appendChild(editButton);
            // 插入 delete 按钮
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "删除";
            deleteButton.classList.add("delete");
            deleteButton.setAttribute('data-toggle', 'modal')
            deleteButton.setAttribute('data-target', '#deleteModal')
            deleteButton.onclick = deleteButtonFunc;
            tr.appendChild(deleteButton);


        }
        
    }
}
if (document.getElementById('listTable'))
    showTaskTable()




function editButtonFunc(event) {
    const selectedRow = $(event.currentTarget).closest("tr");
    console.log(selectedRow);
    const data = selectedRow.find("td");
    // 将选中行数据传递给弹出框
    const modal = document.getElementById('tipText')
    //modal.classList.add("modal");
    let start_time_moment = moment(new Date(data.eq(2).text()))
    let end_time_moment = moment(new Date(data.eq(3).text()))
    modal.innerHTML = `
    <h2>事项信息</h2>
    <p>事项ID：<span id='task-id'>${data.eq(0).text()}</span> </p>
    <p>名称：<input type='text' id='input-new-task-name' value=${data.eq(1).text()}></p>
    <p>开始时间：<input type='datetime-local' id='input-new-start-time' value=${start_time_moment.format("YYYY-MM-DDThh:mm")}></p>
    <p>结束时间：<input type='datetime-local' id='input-new-end-time' value=${end_time_moment.format("YYYY-MM-DDThh:mm")}></p>
    <p>备注：<textarea rows='5' id='input-new-remark'>${data.eq(4).text()}</textarea></p>
    <p>是否已完成：<input type='checkbox' id='input-new-isdone'></p>
    <!--<p><button class='save_button' onclick='modifyTaskSubmit()'>保存</button></p>-->
`;
    // modal.style.position = "fixed";
    // modal.style.top = "50%";
    // modal.style.left = "50%";
    // modal.style.transform = "translate(-50%, -50%)";
    // // 设置modal元素的层级为最高
    // modal.style.zIndex = 1000;
    // const background = document.createElement('div')
    // background.style.position = "absolute";
    // background.style.width = '100%'
    // background.style.height = '100%'
    // background.style.zIndex = '500'

    // //background.style.color
    // modal.addEventListener("click", (e) => {
    //     // 点击modal元素时，关闭modal
    //     if (e.target === modal) {
    //         modal.style.display = "none";
    //         background.style.display = 'none'
    //     }
    // });
    // 显示弹出框
    //document.body.appendChild(background)
    //document.body.appendChild(modal);
    $('#input-new-isdone').attr('checked', data.eq(5).text() === '已完成')
    //window.open('./index.html')
}

function modifyTaskSubmit() {
    let task_id = document.getElementById('task-id').textContent
    let task_name = document.getElementById('input-new-task-name').value;
    let start_time0 = new Date(document.getElementById('input-new-start-time').value);
    let end_time0 = new Date(document.getElementById('input-new-end-time').value);
    let remark = document.getElementById('input-new-remark').value
    let is_done = document.getElementById('input-new-isdone').checked ? 1 : 0
    if (task_name === '') {
        alert('请输入事项名称')
        return
    }
    if (start_time0 === '' || end_time0 === '' || start_time0 >= end_time0) {
        alert('时间输入有误')
        return
    }
    let start_time = start_time0.toLocaleString().substr(0, 19)
    let end_time = end_time0.toLocaleString().substr(0, 19)
    $.ajax({
        url: "http://222.20.105.189:80/task/modifyTask",
        data: { task_id, task_name, start_time, end_time, remark, is_done },
        type: "POST",
        dataType: "json",
        success: function (data) {
            if (data.status === 1) {
                alert(data.message)
            }
            else {
                alert('modify task success')
                location.reload()
            }
        }
    });
}

function deleteButtonFunc(event) {
    const selectedRow = $(event.currentTarget).closest("tr");
    const data = selectedRow.find("td");
    // 将选中行数据传递给弹出框
    const modalFooter = document.getElementById('modal-footer-delete')
    modalFooter.querySelector('.btn.btn-primary').onclick = (event) => { deleteTaskSubmit(event, data.eq(0).text()) }
}

function deleteTaskSubmit(event, task_id) {
    console.log(event, task_id);
    if (event.currentTarget.innerHTML === '取消')
        $('.modal-content').hide()
    else {
        $.ajax({
            url: "http://222.20.105.189:80/task/deleteTask",
            data: { task_id },
            type: "GET",
            dataType: "json",
            success: function (data) {
                if (data.status === 1) {
                    alert(data.message)
                }
                else {
                    alert('delete task success')
                    location.reload()
                }
            }
        });
    }
}