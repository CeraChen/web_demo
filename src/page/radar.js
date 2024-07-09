import React from 'react';
import ReactEcharts from 'echarts-for-react';

export default function RadarChart(props) {
    const { dataList = [] } = props;
    const nameList = props.nameList?.map(item => {
        return {
            ...item,
            name: item,
            max: 10,
        };
    });
    const title = props.title;
    // const legendData = ['2023-04', '2023-03'];

    let dataArr = [
        {
            value: dataList,
            name: title,
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: "#33A1C9"
                        // '#2E8B57',
                        // shadowColor: '#5B8FF9',
                        // shadowBlur: 10,
                    },
                    opacity: 0.8,
                },
            },
            areaStyle: {
                normal: {
                    // 单项区域填充样式
                    // color: "#BDFCC9"
                    color: {
                        type: 'linear',
                        x: 0, //右
                        y: 0, //下
                        x2: 1, //左
                        y2: 1, //上
                        colorStops: [
                            {
                                offset: 0,
                                color: "#33A1C9"
                                // "rgb(46, 139, 87)",
                            },
                            {
                                offset: 0.5,
                                color: 'rgba(176, 224, 230, 0.3)'
                                // 'rgba(189, 252, 201, 0.3)',
                                // color: 'rgba(100,100,100,0)',
                            },
                            {
                                offset: 1,
                                color: "#33A1C9"
                                // "rgb(46, 139, 87)",
                            },
                        ],
                        globalCoord: false,
                    },
                    opacity: 1, // 区域透明度
                },
            },
        },
    ];
    let colorArr = ['rgb(65, 95, 135)']; //颜色
    let option = {
        background: "rgba(189, 252, 201, 0.8)",
            // 'linear-gradient(270deg, rgba(0,0,0,0) 0%, rgba(3,7,22,0.73) 47%, #061135 100%);',
        color: colorArr,
        tooltip: {
            trigger: 'item',
            confine: true, // tooltip始终显示在grid区域内
            // formatter: function(params) {
            //   return '<div style="text-align: left;">' + params.name + '</div>';
            // }
        },
        radar: {
            center: ['50%', '50%'],
            radius: '71%', // 配置整体显示比例
            name: {
                show: true,
                width: 100,
                overflow: 'visible',
                textStyle: {
                    color: "black",
                    fontSize: 13,
                    width: 100,
                    overflow: 'visible', 
                    lineHeight: 16,
                    fontWeight: 'medium'
                },
                formatter: (value, indicator) => {
                    return `${value}`;
                },
            },
            indicator: nameList,
            splitArea: {
                // 坐标轴在 grid 区域中的分隔区域，默认不显示。
                show: true,
                areaStyle: {
                    // 分隔区域的样式设置。
                    color: ['rgba(255,255,255,0)', 'rgba(255,255,255,0)'], // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
                },
            },
            axisLine: {
                //指向外圈文本的分隔线样式
                lineStyle: {
                    color: 'rgba(233,233,233,0.3)',
                },
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(100, 100, 100,0.3)', // 分隔线颜色
                    width: 2, // 分隔线线宽
                },
            },
        },
        series: [
            {
                type: 'radar',
                symbolSize: 5,
                data: dataArr,
            },
        ],
    };
    return (
        <ReactEcharts
            option={option}
            notMerge
            // lazyUpdate
            style={{ height: '200px', width: '320px', marginLeft: '-5px', paddingTop: '15px'}}
        />
    );
}

