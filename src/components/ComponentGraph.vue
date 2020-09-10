<template>
    <div>
        <div style="margin-bottom:10px;">　
        <el-dropdown trigger="click" @command="handleCommand">
            <el-button type="primary">
            Select View<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="Complete View">Complete View</el-dropdown-item>
            <el-dropdown-item command="Issue View">Issue View</el-dropdown-item>
            <el-dropdown-item command="K8s View">K8s View</el-dropdown-item>
            <el-dropdown-item command="Vsystem View">Vsystem View</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        </div>    
        <network ref="network" style="height:1200px;"
            :nodes="comGraph.nodes"
            :edges="comGraph.edges"
            :options="comGraph.options"
        ></network>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                comGraph: {
                    options: {
                        autoResize: true,
                        physics:{
                            enabled: true,
                            adaptiveTimestep: true
                        },
                        edges: {
                            arrows: {
                                to: { enabled: true, scaleFactor: 0.5, type: 'arrow' }
                            },
                            scaling:{
                                label: true,
                            },
                        },
                    },
                    edges: [],
                    nodes: [],
                    edgesComplete: [],
                    nodesComplete: [],
                    edgesK8s: [],
                    nodesK8s: [],
                    edgesVsystem: [],
                    nodesVsystem: [],
                    edgesIssue: [],
                    nodesIssue: [],
                    nodesNameIssue: []
                },
            };
        },
        methods: {
            handleCommand(command) {
                if (command == "K8s View") {
                    this.comGraph.nodes = this.comGraph.nodesK8s
                    this.comGraph.edges = this.comGraph.edgesK8s
                } else if (command == "Vsystem View") {
                    this.comGraph.nodes = this.comGraph.nodesVsystem
                    this.comGraph.edges = this.comGraph.edgesVsystem
                } else if (command == "Issue View") {
                    this.comGraph.nodes = this.comGraph.nodesIssue
                    this.comGraph.edges = this.comGraph.edgesIssue
                } else {
                    this.comGraph.nodes = this.comGraph.nodesComplete
                    this.comGraph.edges = this.comGraph.edgesComplete
                }
            },
            setComponentGraphData() {
                var input = this.checkResultData
                this.comGraph.edges = JSON.parse(input).componentsGraph.edges;
                this.comGraph.nodes = JSON.parse(input).componentsGraph.nodes;
                this.comGraph.edgesComplete = JSON.parse(input).componentsGraph.edges;
                this.comGraph.nodesComplete = JSON.parse(input).componentsGraph.nodes;
                for (var i in this.comGraph.nodesComplete) {
                    if (this.comGraph.nodesComplete[i].id.indexOf("di")==0 || this.comGraph.nodesComplete[i].id.indexOf("node")==0 || this.comGraph.nodesComplete[i].id.indexOf("pod")==0 || this.comGraph.nodesComplete[i].id.indexOf("container")==0) {
                    this.comGraph.nodesK8s.push(this.comGraph.nodesComplete[i])
                    if (this.comGraph.nodesComplete[i].id.indexOf("di")==0) {
                        this.comGraph.nodesVsystem.push(this.comGraph.nodesComplete[i])
                    }
                    } else if (this.comGraph.nodesComplete[i].id.indexOf("di")==0 || this.comGraph.nodesComplete[i].id.indexOf("tenant")==0 || this.comGraph.nodesComplete[i].id.indexOf("user")==0 || this.comGraph.nodesComplete[i].id.indexOf("app")==0 || this.comGraph.nodesComplete[i].id.indexOf("graph")==0) {
                    this.comGraph.nodesVsystem.push(this.comGraph.nodesComplete[i])
                    }
                    // record the problem node
                    if (this.comGraph.nodesComplete[i].color == "#F56C6C") {
                    this.comGraph.nodesIssue.push(this.comGraph.nodesComplete[i])
                    this.comGraph.nodesNameIssue.push(this.comGraph.nodesComplete[i].id)
                    }
                }
                // var currProblemNodeNum = vm.comGraph.nodesNameIssue.length
                var nodesNameIssueAdded = new Array()
                for (var i in this.comGraph.edgesComplete) {
                    if ((this.comGraph.edgesComplete[i].from.indexOf("di")==0 || this.comGraph.edgesComplete[i].from.indexOf("node")==0 || this.comGraph.edgesComplete[i].from.indexOf("pod")==0 || this.comGraph.edgesComplete[i].from.indexOf("container")==0) 
                        && (this.comGraph.edgesComplete[i].to.indexOf("node")==0 || this.comGraph.edgesComplete[i].to.indexOf("pod")==0 || this.comGraph.edgesComplete[i].to.indexOf("container")==0)) {
                    this.comGraph.edgesK8s.push(this.comGraph.edgesComplete[i])
                    } else if ((this.comGraph.edgesComplete[i].from.indexOf("di")==0 || this.comGraph.edgesComplete[i].from.indexOf("tenant")==0 || this.comGraph.edgesComplete[i].from.indexOf("user")==0 || this.comGraph.edgesComplete[i].from.indexOf("app")==0 || this.comGraph.edgesComplete[i].from.indexOf("graph")==0) 
                        && (this.comGraph.edgesComplete[i].to.indexOf("tenant")==0 || this.comGraph.edgesComplete[i].to.indexOf("user")==0 || this.comGraph.edgesComplete[i].to.indexOf("app")==0 || this.comGraph.edgesComplete[i].to.indexOf("graph")==0)) {
                    this.comGraph.edgesVsystem.push(this.comGraph.edgesComplete[i])
                    }
                    if (this.comGraph.nodesNameIssue.indexOf(this.comGraph.edgesComplete[i].to) != -1) {
                    this.comGraph.edgesIssue.push(this.comGraph.edgesComplete[i])
                    nodesNameIssueAdded.push(this.comGraph.edgesComplete[i].from)
                    }
                }
                this.comGraph.nodesNameIssue = nodesNameIssueAdded
                for (var i in this.comGraph.nodesComplete) {
                    if (this.comGraph.nodesNameIssue.indexOf(this.comGraph.nodesComplete[i].id) != -1) {
                        this.comGraph.nodesIssue.push(this.comGraph.nodesComplete[i])
                    }
                }
                // construct issue view
                while (this.comGraph.nodesNameIssue.length != 0) {
                    // add edges and record node name
                    nodesNameIssueAdded = []
                    for (var i in this.comGraph.edgesComplete) {
                    if (this.comGraph.nodesNameIssue.indexOf(this.comGraph.edgesComplete[i].to) != -1) {
                        this.comGraph.edgesIssue.push(this.comGraph.edgesComplete[i])
                        nodesNameIssueAdded.push(this.comGraph.edgesComplete[i].from)
                    }
                    }
                    this.comGraph.nodesNameIssue = nodesNameIssueAdded
                    this.comGraph.nodesNameIssue = Array.from(new Set(this.comGraph.nodesNameIssue))

                    // add node according to node name
                    for (var i in this.comGraph.nodesComplete) {
                    if (this.comGraph.nodesNameIssue.indexOf(this.comGraph.nodesComplete[i].id) != -1) {
                        this.comGraph.nodesIssue.push(this.comGraph.nodesComplete[i])
                    }
                    }
                }
                this.comGraph.nodesIssue = Array.from(new Set(this.comGraph.nodesIssue))
                this.comGraph.edgesIssue = Array.from(new Set(this.comGraph.edgesIssue))
            }
        },
        props:['checkResultData'],
        mounted() {
            this.setComponentGraphData()
        }
    }
</script>