// 逻辑入口页面

const Counter = {
    data () {
        return {
            dataList: [],
        }
    },
    mounted() {
        fetch('./data.json').then(response => {
            return response.json()
        }).then(json => {
            this.dataList = this.mergeData(json.dataList)
        })
        
    },
    methods: {
        isEmpty (val) {
            return typeof val == 'undefined' || val === null || val == '-'
        },
        isObject(val) {
            return Object.prototype.toString.call(val) === '[object Object]'
        },
        arraySpanMethod({ row,column, rowIndex, columnIndex }) {
            const span = column['property'] + '-span'
            if(row[span]){
                return row[span]
            }
        },
        addRow(row,index) {
            let arr = [].concat(this.dataList)
            arr.splice(index, 0 , Object.assign({},row))
            
            this.dataList = this.mergeData( arr )
        },
        delRow(index) {
            this.dataList.splice(index, 1)
            this.dataList = this.mergeData(this.dataList)
        },
        mergeData( list ) {
            // mergeTarge - 合并项依据
            // combineProp - 根据mergeTarge 进行合并的单元格属性
            let config = {
                mergeTarget: 'id', // 通用依据
                combineProp: [
                    'id',
                    'name',
                    {
                        mergeTarget: 'name',
                        combineProp: ['amount1','amount2']
                    },
                    'amount3'
                ]
            } 
            return this.filterData( config, [].concat(list) )
        },
        filterData( config, dataList, targetProp ) {
            const { mergeTarget, combineProp } = config
            // 叠加的合并条件
            combineProp.forEach((column, index) => {
                // 记录合并项
                let combineCount = 1
                if( this.isObject( column ) ) {
                    return this.filterData.call(this, column, dataList, mergeTarget)
                }
                // 使用倒序遍历
                for(let i = dataList.length -1; i >= 0 ; i--) {
                    let curr = dataList[i],
                        prev = dataList[i-1]
                    
                    if(this.isEmpty(prev)) {
                        // 已经循环完毕
                        curr[`${column}-span`] = {
                            rowspan: combineCount,
                            colspan: combineCount >= 1 ? 1 : 0
                        }
                        break;
                    }

                    if( ( prev[targetProp] === curr[targetProp] &&
                            prev[mergeTarget] === curr[mergeTarget] ) &&
                            prev[`${column}`] === curr[`${column}`] 
                        ) { 

                        ++combineCount;
                        curr[`${column}-span`] = {
                            rowspan: 0,
                            colspan: 0
                        } 

                    } else {
                        curr[`${column}-span`] = {
                            rowspan: combineCount,
                            colspan: combineCount >= 1 ? 1 : 0
                        } 
                        prev[`${column}-span`] = {
                            rowspan: 1,
                            colspan: 1,
                        }
                        // 前后项不相符时，对combinecount进行重置
                        combineCount = 1
                    }  
                }
            })
            return dataList
        },
    },                                                                                                                                                                                                                                                                                    
    computed: {
        colDataList() {
            return [{
                label: 'ID',
                prop: 'id'
            }, {
                label: '姓名',
                prop: 'name'
            }, {
                label: '数值1',
                prop: 'amount1'
            }, {
                label: '数值2',
                prop: 'amount2'
            }, {
                label: '数值3',
                prop: 'amount3'
            }]
        }
    }
}

export default Counter