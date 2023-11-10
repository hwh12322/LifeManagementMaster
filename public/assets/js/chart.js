let dom = document.getElementById('container');
let myChart = echarts.init(dom, null, {
    renderer: 'canvas',
    useDirtyRect: false
});
let app = {};


function getTaskToday() {
    let username = localStorage.getItem('username')
    let tasks
    $.ajax({
        url: `http://${serverHost}/task/getTask`,
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
    let beginTime = moment().startOf('day')
    let endTime = moment().endOf('day')

    let taskToday = []
    for (task of tasks) {
        if (beginTime.isBefore(moment(task.start_time)) && moment(task.end_time).isBefore(endTime))
            taskToday.push({ "task_id": task.task_id, "task_name": task.task_name, "start_time": moment(task.start_time), "end_time": moment(task.end_time), "remark": task.remark, "is_done": task.is_done })
    }

    let tasks_name = taskToday.map((task) => task.task_name)
    let tasks_start_time = taskToday.map((task) => task.start_time.diff(beginTime, 'hours', true).toFixed(1))
    let tasks_during_time = taskToday.map((task) => task.end_time.diff(task.start_time, 'hours', true).toFixed(1))
    return { tasks_name, tasks_start_time, tasks_during_time }
}

let { tasks_name, tasks_start_time, tasks_during_time } = getTaskToday()
let option = {
    title: {
        text: '今日事项',
        subtext: '',
        textStyle: {
            color: 'white', // 设置标题的文本颜色
            fontStyle: 'italic', // 设置标题的字体样式，如 italic、oblique、normal
            fontWeight: 'bold', // 设置标题的字体粗细，如 normal、bold、bolder、lighter
            fontFamily: 'Arial, sans-serif', // 设置标题的字体系列
            fontSize: 20 // 设置标题的字体大小
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        formatter: function (params) {
            let tar = params[1];
            return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
        },
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    yAxis: {
        type: 'category',
        splitLine: { show: false },
        data: tasks_name
    },
    xAxis: {
        type: 'value',
        min: 0, // 设置 x 轴下限为 00:00
        max: 24, // 设置 x 轴上限为 24:00
        interval: 1,
        axisLabel: {
            formatter: function (value, index) {
                let hours = Math.floor(value); // 获取整数部分作为小时
                let minutes = Math.round((value - hours) * 60); // 获取小数部分并转换为分钟
                let timeString = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0'); // 格式化时间为 时:分 形式
                return timeString;
            }
        }
    },
    series: [
        {
            name: '开始时刻',
            type: 'bar',
            stack: 'Total',
            itemStyle: {
                borderColor: 'transparent',
                color: 'transparent'
            },
            label: {

                position: 'inside'
            },
            emphasis: {
                itemStyle: {
                    borderColor: 'transparent',
                    color: 'transparent'
                }
            },
            data: tasks_start_time
        },
        {
            name: '持续时间（小时）',
            type: 'bar',
            stack: 'Total',
            label: {

                position: 'inside'
            },
            data: tasks_during_time
        }
    ]
};

if (option && typeof option === 'object') {
    myChart.setOption(option);
}

window.addEventListener('resize', myChart.resize);