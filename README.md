# el-table 单元格合并
vue+element开发，开发需求中table部分单元格合并条件为叠加的，且可以动态增删。
## Installtion
```
cnpm i 
npm start
```
### Usage
```
// method中的mergeData方法设置合并条件
// mergeTarge - 合并项依据
// combineProp - 需合并单元格属性

let config = {
    mergeTarget: 'id',
    combineProp: [
        ....,
        { // 合并项需要多个条件时
            mergeTarget: ...,
            combineProp: []
        }
    ] 
}
```