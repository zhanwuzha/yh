import * as duckdb from '@duckdb/duckdb-wasm';
import {DuckDBDataProtocol} from "@duckdb/duckdb-wasm";
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm';
import duckdb_wasm_next from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm';
import desc from'./fund-desc.parquet'
import nav from'./fund-nav.parquet'
import {tableFromIPC} from "apache-arrow";

const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
  mvp: {
    mainModule: duckdb_wasm,
    mainWorker: new URL('@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js', import.meta.url).toString(),
  },
  eh: {
    mainModule: duckdb_wasm_next,
    mainWorker: new URL('@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js', import.meta.url).toString(),
  },
};
const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
// Instantiate the asynchronus version of DuckDB-wasm
const worker = new Worker(bundle.mainWorker!);
const logger = new duckdb.ConsoleLogger();
const db = new duckdb.AsyncDuckDB(logger, worker);

await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
const conn = await db.connect()

export const DBHostDESC = `http://localhost:9002${desc}`
export const DBHostNAV = `http://localhost:9002${nav}`

export const fetchData = async (path)=>{
  // let string = `SELECT * FROM 'http://localhost:9002${path=='desc'?desc:nav}' ${sql}`
  console.log(path)
  const result = await conn.query(path)
  let items
  if (result.numCols && result.numRows) {
    //目前能拿到数据了
    items = JSON.parse(JSON.stringify(result.toArray()))
    console.log(result)
    // console.log(result.toArray())
  }
  console.log('query------',items)

  return items
}
export const close = async ()=>{
  await conn.close()
  await db.terminate()
  await worker.terminate()
}

// export const  navData = await fetchData('nav')

// const temp = await tableFromIPC(await conn.query(`SELECT * FROM 'http://localhost:9002${desc}' limit 10` ))
// console.log([...temp])


// Select a bundle based on browser checks
// const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
// // Instantiate the asynchronus version of DuckDB-wasm
// const worker = new Worker(bundle.mainWorker!);
// const logger = new duckdb.ConsoleLogger();
// const db = new duckdb.AsyncDuckDB(logger, worker);


// await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

// const conn = await db.connect()

//不知道为啥这种写法不行。Error: Catalog Error: Table with name mytable does not exist!
// await db.registerFileHandle('mytable',desc , DuckDBDataProtocol.BROWSER_FILEREADER, true);
// const result = await conn.query(`SELECT * FROM 'mytable' limit 10` )

// const url = 'https://shell.duckdb.org/data/tpch/0_01/parquet/fund-desc.parquet'
// const url = 'https://origin/remote.parquet'
// await db.registerFileURL('remote.parquet', url, DuckDBDataProtocol.HTTP, false);

// const result = await conn.query(`SELECT * FROM 'http://localhost:9002${desc}' ` )
//
// console.log(conn)
// console.log(result)
// let items
// if (result.numCols && result.numRows) {
//   //目前能拿到数据了
//   items = JSON.parse(JSON.stringify(result.toArray()))
//   console.log(items)
//
// }
