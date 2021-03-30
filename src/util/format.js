import dayjs from 'dayjs';

const hasYear = (arr, value) => {
    if (!arr.length) return false;

    return arr.filter((item) => item.value == value).length;
};

const yearIndex = (arr, value) => {
    return arr.findIndex((item) => item.value == value);
};

const hasDay = (arr, year, value) => {
    if (!arr.length) return false;

    const _yearIndex = yearIndex(arr, year);
    if (!arr[_yearIndex].children.length) return false;

    return arr[_yearIndex].children.filter((item) => item.value === value)
        .length;
};

const dayIndex = (arr, year, value) => {
    const _yearIndex = yearIndex(arr, year);

    return arr[_yearIndex].children.findIndex((item) => item.value == value);
};

const hasHour = (arr, year, day, value) => {
    if (!arr.length) return false;

    const _yearIndex = yearIndex(arr, year);
    const _dayIndex = dayIndex(arr, year, day);

    if (!arr[_yearIndex].children[_dayIndex].children.length) return false;

    return arr[_yearIndex].children[_dayIndex].children.filter(
        (item) => item.value === value
    ).length;
};

// 传入时间戳数组，返回符合 <el-cascader /> 组件的数据结构
export const parseTimeline = (timeline) => {
    const options = [];
    timeline.map((time) => {
        const _dayjs = dayjs(time * 1000).format('YYYY-MM-DD HH:mm:ss');

        const year = _dayjs.match(/.{7}/)[0];
        if (!hasYear(options, year)) {
            options.push({
                label: year,
                value: year,
                children: [],
            });
        }

        const day = _dayjs.match(/.{7}-(.{2})/)[1];
        if (!hasDay(options, year, day)) {
            options[yearIndex(options, year)].children.push({
                label: day,
                value: day,
                children: [],
            });
        }

        const hour = _dayjs.match(/.{11}(.{8})/)[1];
        if (!hasHour(options, year, day, hour)) {
            options[yearIndex(options, year)].children[
                dayIndex(options, year, day)
            ].children.push({
                label: hour,
                value: time,
            });
        }
    });
    return options;
};
