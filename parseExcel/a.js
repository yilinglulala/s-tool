const XLSX = require('xlsx')
const fs = require('fs')

let res = {}
let needUnit = ['top','left','width','height']

let fileName = "oppoR12"
    fileName = "oppoR24"
    // fileName = "qdh"

let workbook = XLSX.readFile(`${fileName}.xlsx`)
let ltd = []

workbook.SheetNames.forEach(sheetName=>{
	let table = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
	let arr = []
	table.forEach((item, i) => {
		let obj = {}
		// k -> style-top
		for (let k in item) {
			let v = item[k]
			if (k.includes('-')) {
				let [name1, name2] = k.split('-')
				if (!obj[name1]) { obj[name1] = {} }
				
					v=handleVal(v,name2)
				obj[name1][name2] = v
			} else {
				obj[k] = v
			}
		}
		// 机柜特殊处理
		if(sheetName==='cab'){
			obj.component = 'cab',obj.children = [1];
			if(obj.ltd){
				ltd.push({
					"mtl": obj.ltd,
	                "pos": {
	                    "x": obj.pos.x,
	                }
				})
			}
		}
		arr.push(obj)
	})

	res[sheetName] = arr
})

// let {cab,ltd,other,layOther,waterLeak} = res
let {cab,other,layOther,waterLeak,modelAndLayout} = res


let basePath = 'F:/2021-new-path/dev.tencent.v3.1/wisetablet/public/config2/'

// // 处理历史布局
// let str = JSON.stringify([...cab,...layOther],null,4)
// fs.writeFile(basePath+'cofJson.json',str,err=>{
//     if(!err){
//         console.log('cofJson.json写入成功');
//     }
// })

// 处理机柜模型
let {mtls,textures} = getMtlsAndTexture(cab)
fs.readFile(basePath+'cabModel.json','utf-8',(e,data)=>{
	data = JSON.parse(JSON.stringify(data))
	d = JSON.parse(data)
    d.Models = {cab,ltd,other}
    d.Rule = {...d.Rule,mtls,textures}
    d.layOther = layOther

    let cabX = cab.map(v=>v.pos.x)
    d.Rule.len =( Math.max(...cabX)-Math.min(...cabX))/2+32
    d.waterLeak = waterLeak[0]
    // 处理可配模型
    modelAndLayout && modelAndLayout.forEach(item=>{
    	if (!item.id) {
    		if(d.Models.other){
    			d.Models.other.push(item)
    		}else{
    			d.Models.other = [item]
    		}
    	}
    	
    })
    d.modelAndLayout = modelAndLayout
    // 处理可配模型结束
    let str = JSON.stringify(d,null,4)
    fs.writeFile(basePath+'cabModel.json',str,err=>{
	    if(!err){
	        console.log('cabModel.json写入成功');
	    }
	})
})

// 漏水绳
// fs.readFile(basePath+'someConfig.json','utf-8',(e,data)=>{
// 	data = JSON.parse(JSON.stringify(data))
// 	d = JSON.parse(data)
//     d.waterLeak = waterLeak[0]
//     let str = JSON.stringify(d,null,4)
//     fs.writeFile(basePath+'someConfig.json',str,err=>{
// 	    if(!err){
// 	        console.log('someConfig.json写入成功');
// 	    }
// 	})
// })

// 处理值，单位
function handleVal(v,name2){
	if(needUnit.includes(name2)&&!(v+"").includes('rem')){v+='%'}
		return v
}
// 获取机柜所用到的模型和贴图
function getMtlsAndTexture(cab){
	let mtls=new Set(),textures=new Set();
	[...cab,...ltd,...other].forEach((item)=>{
		item.mtl && mtls.add(item.mtl)
		item.texture && textures.add(item.texture)
	})
	textures.delete('no_chg')
	// 处理可配模型中的模型和贴图
	if(modelAndLayout){
		modelAndLayout.forEach(item=>{
			item.mtl && mtls.add(item.mtl);
			if(item.expr&&item.expr.startsWith('[')){
	    		item.expr = JSON.parse(item.expr)
	    		item.expr.forEach((exprItem) => {
	                exprItem.mtl && mtls.add(exprItem.mtl);
	            });
	    	}
		})
		
	}
	return {
		mtls:[...mtls],
		textures:[...textures]
	}
}