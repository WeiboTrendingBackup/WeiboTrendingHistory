<template>
    <div class="container">
        <a
            href="https://github.com/WeiboTrendingBackup/WeiboTrendingHistory"
            class="github-corner"
            aria-label="View source on GitHub"
            target="_blank"
            ><svg
                width="80"
                height="80"
                viewBox="0 0 250 250"
                style="
                    fill: #151513;
                    color: #fff;
                    position: fixed;
                    top: 0;
                    border: 0;
                    right: 0;
                "
                aria-hidden="true"
            >
                <path
                    d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"
                ></path>
                <path
                    d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
                    fill="currentColor"
                    style="transform-origin: 130px 106px"
                    class="octo-arm"
                ></path>
                <path
                    d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
                    fill="currentColor"
                    class="octo-body"
                ></path></svg
        ></a>
        <nav>
            <div>
                <div class="left">
                    <img
                        class="logo"
                        src="../assets/logo.svg"
                        alt="weibo logo"
                    />
                    <h1>微博热搜榜历史</h1>
                </div>
                <div class="right">
                    <span class="time-info">时间：</span>
                    <el-cascader
                        size="small"
                        v-model="createdTime"
                        :options="timeline"
                        placeholder="选择时间"
                        :show-all-levels="true"
                        separator="-"
                    ></el-cascader>
                    <el-select size="small" v-model="type" placeholder="请选择">
                        <el-option
                            v-for="item in types"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                    <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-search"
                        @click="search"
                        >查看</el-button
                    >
                </div>
            </div>
        </nav>
        <div class="content">
            <el-skeleton v-if="!data.length" :rows="10" />
            <table v-else>
                <thead>
                    <tr class="thead_tr">
                        <th class="th-01">序号</th>
                        <th class="th-02">关键词</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in data" :key="item.index">
                        <td
                            v-if="item.type == 0 && item.index == 0"
                            class="td-01"
                        >
                            <i class="icon-top"></i>
                        </td>
                        <td v-else class="td-01 ranktop">{{ item.index }}</td>
                        <td class="td-02">
                            <a
                                :href="
                                    'https://s.weibo.com/weibo?q=' + item.name
                                "
                                target="_blank"
                                >{{ item.name }}</a
                            >
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <footer>
            <h2>「为 100 年后的历史学家研究当下提供第一手资料」</h2>
        </footer>
    </div>
</template>

<script>
import { parseTimeline } from '../util/format';

export default {
    name: 'Content',
    props: {
        msg: String,
    },
    data() {
        return {
            types: [
                {
                    label: '热搜榜',
                    value: 0,
                },
                {
                    label: '要闻榜',
                    value: 1,
                },
            ],
            createdTime: [],
            type: 0,
            timeline: [],
            topics: [], // 热搜榜
            hashtags: [], // 要闻榜
            data: [],
        };
    },
    methods: {
        search() {
            // TODO loading 太简单粗暴了
            this.data = [];
            this.getData(this.createdTime, this.type);
        },
        getData(createdTime = '', type = 0) {
            // const url = `http://localhost:8080/api/list?created_time=${createdTime}&type=${type}`;
            const url = `https://warm-reef-76661.herokuapp.com/api/list?created_time=${createdTime}&type=${type}`;
            fetch(url)
                .then((res) => res.json())
                .then((res) => {
                    // 将所有平级的时间转换成 日期-小时 的两级下拉选择框。
                    // 如果已经有数据了，比如用户继续点击搜索，并没有刷新页面的话。就不重复赋值了。
                    if (!this.timeline.length) {
                        this.timeline = parseTimeline(res.timeline);
                        this.createdTime = [
                            this.timeline[0].value,
                            this.timeline[0].children[0].value,
                            this.timeline[0].children[0].children[0].value,
                        ];
                    }
                    this.data = res.data;
                })
                .catch((err) => {
                    console.log('请求接口出错：', err);
                });
        },
    },
    created() {
        this.getData('', this.type);
    },
    mounted() {
        console.log('data', this.data.length);
    },
};
</script>

<style scoped>
.container {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: fit-content;
    margin: auto;
    margin-top: 100px;
}
nav {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 48px;
    background: #fff;
}
nav::after {
    box-shadow: 0 2px 3px 0 rgb(0 0 0 / 7%);
    display: block;
    position: absolute;
    top: 48px;
    color: rgba(0, 0, 0, 0.07);
    content: '';
    width: 100%;
    height: 2px;
}
nav > div {
    position: relative;
    top: 1px;
    height: 100%;
    width: 1280px;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: space-around;
}
nav .left,
nav .right {
    display: flex;
    align-items: center;
}

nav .left *,
nav .right * {
    margin: 0 5px;
}
nav .right .time-info {
    color: #999;
    font-size: 16px;
}
.logo {
    width: 40px;
    height: 40px;
    display: block;
}
h1 {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: normal;
    cursor: pointer;
}
footer {
    margin: 50px auto;
}
h2 {
    font-weight: normal;
    text-align: center;
    font-size: 18px;
    color: #999;
}
.content {
    margin-top: 50px;
    min-height: calc(100vh - 200px);
    width: 580px;
}
table {
    margin: auto;
    border-collapse: collapse;
    border-spacing: 0;
}
.icon-top {
    display: inline-block;
    width: 16px;
    height: 13px;
    background: url(../assets/icon_top.png);
    background-repeat: no-repeat;
}
.ranktop,
td.td-01 {
    color: #f26d5f;
    text-align: center;
    font-size: 14px;
}

tr:hover {
    background: #f2f2f5;
}
th.th-01 {
    width: 80px;
}
th.th-02 {
    width: 500px;
    text-align: left;
}
th {
    line-height: 30px;
    border-bottom: solid 1px #fbfbfb;
    color: #999;
    font-size: 15px;
}
td {
    border-bottom: solid 1px #f2f2f5;
    line-height: 36px;
    font-size: 16px;
}
a {
    color: #0078b6;
    text-decoration: none;
    cursor: pointer;
    outline: none;
}
</style>

<style>
.container .el-button--primary {
    background-color: #f85d00;
    border-color: #f85d00;
}
.container .el-button--primary:focus,
.container .el-button--primary:hover {
    background-color: #ff8033;
    border-color: #ff8033;
}

.github-corner svg {
    z-index: 100;
}
.github-corner:hover .octo-arm {
    animation: octocat-wave 560ms ease-in-out;
}
@keyframes octocat-wave {
    0%,
    100% {
        transform: rotate(0);
    }
    20%,
    60% {
        transform: rotate(-25deg);
    }
    40%,
    80% {
        transform: rotate(10deg);
    }
}
@media (max-width: 500px) {
    .github-corner:hover .octo-arm {
        animation: none;
    }
    .github-corner .octo-arm {
        animation: octocat-wave 560ms ease-in-out;
    }
}
</style>
