let serverHost = '47.98.240.60:10010'
function usernameShow() {//更新右上方用户名显示
    let username = localStorage.getItem('username')
    if (!username) {
        alert('请先登录')
        window.location.href = './login.html'
    }
    else {
        $('.mb-0.text-sm.font-weight-bold').text(username)
        $('#input-username').attr('value', username)
        $('.display-2.text-white').text(`你好 ${username}`)
    }
}

if (document.querySelector('.mb-0.text-sm.font-weight-bold'))
    usernameShow()

function EditProfileSwitch() {
    let button = document.getElementById("EditProfile");
    let username = document.getElementById("input-username");
    let password = document.getElementById('input-password');
    let newPassword = document.getElementById('input-newPassword');
    let newPassword_confirm = document.getElementById('input-newPassword-confirm');
    if (username.readOnly === true) {
        $('.form-control.form-control-alternative').attr('readOnly', false)
        button.textContent = "保存信息";
    }
    else {//保存用户信息
        if (!userInfoCheck(username.value, newPassword.value, newPassword_confirm.value)) {
            event.preventDefault()
            return
        }
        $.ajax({
            url: `http://${serverHost}/user/UserInfoChange`,
            data: { username: localStorage.getItem('username'), newUsername: username.value, password: md5(password.value), newPassword: md5(newPassword.value) },
            type: "POST",
            dataType: "json",
            success: function (data) {
                if (data.status === 1) {
                    alert(data.message)
                }
                else {
                    alert('账号信息修改成功')
                    localStorage.setItem('username', newUsername)
                    window.location.reload()
                }
            }
        });
    }
}

function userInfoCheck(username, password, password_confirm) {
    if (username === '' || password === '') {
        alert('用户名和密码不能为空!')
        return false
    }
    else if (password_confirm !== undefined) {
        if (password !== password_confirm) {
            alert('两次输入密码不一致!')
            return false
        }
        else if (password_confirm.length < 8 || password_confirm.length > 20) {
            alert('请输入8-20位的密码!')
            return false
        }
    }
    return true

}

function registerButton(event) {
    const username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    const password_confirm = document.getElementById('password-confirm').value
    if (!userInfoCheck(username, password, password_confirm)) {
        event.preventDefault()
        return
    }
    password = md5(password)
    $.ajax({
        url: `http://${serverHost}/user/register`,
        type: "POST",
        data: { username, password },
        dataType: "json",
        success: function (data) {
            if (data.status === 1) {
                alert(data.message)
            }
            else {
                alert('注册成功！')
                window.location.href = './login.html'
            }
        }
    });
}
$('#registerButton').on('click', registerButton)

function loginButton(event) {
    const username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    if (!userInfoCheck(username, password)) {
        event.preventDefault()
        return
    }
    password = md5(password)
    $.ajax({
        url: `http://${serverHost}/user/login`,
        type: "POST",
        data: { username, password },
        dataType: "json",
        success: function (data) {
            if (data.status === 1) {
                alert('用户名或密码错误！')
            }
            else {
                alert('登录成功！')
                localStorage.setItem('username', username)
                window.location.href = './index.html'
            }
        }
    });
}
$('#loginButton').on('click', loginButton)

function logoutButton(event) {
    username = localStorage.removeItem('username')
    window.location.href = './login.html'
}
$('#logoutButton').on('click', logoutButton)