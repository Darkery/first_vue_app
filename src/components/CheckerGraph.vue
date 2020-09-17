<template>
    <div style="position: relative;">
        <div id="tags">
            <el-tag
                v-for="item in tagItems"
                :key="item.label"
                :type="item.type"
                effect="dark">
                {{ item.label }}
            </el-tag>
        </div>
        <div id="checkerGraphID"></div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                myChart: '',
                tagItems: [
                    { type: 'success', label: 'Finished' },
                    { type: 'info', label: 'Skipped' },
                    { type: 'danger', label: 'Failed' }
                ],
            };
        },
        props:['checkResultData'],
        methods: {
            drawCheckerGraph() {
                var responseData = this.checkResultData
                var data_k8s = JSON.parse(responseData).k8s_runtimeGraph
                var data_vsystem = JSON.parse(responseData).vsystem_runtimeGraph
                const echarts = require('echarts');
                this.myChart = echarts.init(document.getElementById('checkerGraphID'));
                
                let option = {
                    tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove'
                    },
                    legend: [
                    {
                        top: '10',
                        left: '10',
                        orient: 'horizontal',
                        icon: 'roundRect',
                        textStyle: {
                        fontSize: 15
                        }
                    }
                    ],
                    series:[
                    {
                        type: 'tree',
                        name: 'vsystem_checker_graph',
                        data: [data_vsystem],
                        left: '14%',
                        right: '65%',
                        symbolSize: 10,
                        initialTreeDepth: 2,
                        roam: true,
                        itemStyle: {
                        },
                        label: {
                        fontSize: 15,
                        position: 'left',
                        verticalAlign: 'middle',
                        align: 'right'
                        },
                        leaves: {
                        label: {
                            position: 'right',
                            verticalAlign: 'middle',
                            align: 'left'
                        }
                        }
                    },
                    {
                        type: 'tree',
                        name: 'k8s_checker_graph',
                        data: [data_k8s],
                        left: '60%',
                        right: '20%',
                        symbolSize: 10,
                        initialTreeDepth: 1,
                        roam: true,
                        label: {
                        fontSize: 15,
                        position: 'left',
                        verticalAlign: 'middle',
                        align: 'right'
                        },
                        leaves: {
                        label: {
                            position: 'right',
                            verticalAlign: 'middle',
                            align: 'left'
                        }
                        }
                    }
                    ]
                };
                this.myChart.setOption(option)
            }
        },
        mounted() {
            this.drawCheckerGraph()
        }
    }
</script>


<style scoped>
    #checkerGraphID {
        margin: auto;
        height: 800px;
        text-align: left;
    }
</style>