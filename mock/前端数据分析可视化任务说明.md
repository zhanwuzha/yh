# 前端数据分析可视化任务说明

## 数据文件说明

`fund-desc.parquet` parquet格式公募基金基础信息, 包含字段: 

- ticker 基金代码
- name 基金名称
- mgmt 基金管理人
- custodian 基金托管人
- incept dt 基金成立日

`fund-nav.parquet` parquet格式公募基金单位净值信息, 包含字段:

- ticker 基金代码
- dt 净值日期
- nav 单位净值


## 基础处理逻辑

- 完全在浏览器中运行的javascript/webassembly单页应用，用于进行数据处理与可视化
- 项目引入duckdb-wasm, 通过duckdb的能力通过http协议读入2个parquet, 再使用duckdb对数据进行各类的分析处理得到需要展示的数据结果
- 在浏览器页面中展示数据, 涉及到各类可视化图表与数据表


## 基础文档

- DuckDB文档 <https://duckdb.org/docs/>
- DuckDB WASM文档 <https://duckdb.org/docs/api/wasm/overview>
- Apache Arrow JS文档 <https://arrow.apache.org/docs/js/>

## 数据结构探索

- 访问 <https://shell.duckdb.org>
- 执行 `.files add` 添加 `fund-desc.parquet` 和 `fund-nav.parquet` 文件
- 执行相关SQL探索数据结构, 如`select * from read_parquet('fund-desc.parquet') limit 10`
- 可选附加任务: 尝试完全在本地环境中部署shell.duckdb.org的代码, 代码地址: <https://github.com/duckdb/duckdb-wasm/blob/main/packages/duckdb-wasm-app>

## 具体开发任务

### 1. 前端项目基础布局

使用你最熟悉的JS技术栈与界面组件构建一个前端开发项目, 项目页面为一个数据分析看板, 包含多个Tab页面，每个Tab页面会有若干数据表与可视化图表.
页面打开后使用duckdb-wasm从一个开发http服务中读入`fund-desc.parquet` 和 `fund-nav.parquet` 文件. 使得你的程序可以在浏览器中使用duckdb/sql对这两个文件进行访问分析

### 2. 基础数据展示

- 开发基金信息页签: 在一个数据表格组件中展示`fund-desc.parquet`文件中的所有行与所有列
- 开发基金净值页签: 下拉选择框选项为`fund-desc.parquet`中所有的基金代码, 选择一个基金代码, 在一个分页数据表格组件中展示这个基金代码在`fund-nav.parquet`中所有的每日净值数据

### 3. 基础可视化

- 开发管理人托管人页签: 计算每一个管理人与托管人名下各有多少只基金, 选取对应基金最多的10个管理人与托管人, 分别绘制管理人与托管人对应基金数量的饼状图.
- 开发基金成立分析页签: 计算每一个自然年各有多少基金成立，绘制柱状图，横轴为年份，纵轴为基金成立数量.
- 开发基金净值走势图页签: 下拉选择框选项为`fund-desc.parquet`中所有的基金代码，日期选择框两个为开始与结束日期, 选择基金代码与开始结束日期, 绘制此基金净值在开始结束日期之间的单位净值走势折线图

### 4. 基金收益率分析

- 计算基金的日收益率: `基金日收益率 = (基金当日净值 - 基金上一日净值) - 1`, 在DuckDB WASM中使用SQL计算, 为`fund-nav.parquet`添加一列基金日收益率`chg`
- 开发基金收益率标准差页签: 计算最近10年每一只基金在每一个自然年基金日收益率的标准差, 结果数据使用duckdb的pivot功能变换为宽表, 在列上为基金，在行上为自然年，在一个数据表格组件中展示结果

基金收益率标准差样例:

```
ticker,2020,2021,2022,2023
000001,0.02,0.02,0.02,0.02
000003,0.03,0.04,0.06,0.09
000006,0.05,0.04,0.02,0.02
000005,0.04,0.03,0.01,0.05
```

## 代码交付

- 请提供完成的项目工程代码(提供完整的git repo更为理想). 项目应该可使用`npm i`安装依赖, 使用`npm run dev`打包运行, 页面运行地址应为http://localhost:9002，访问页面后可以使用上述的具体功能.
- 用于验证的环境为Ubuntu 22.04 x86_64. Node.js版本为v20.18.0. npm版本为10.8.2
