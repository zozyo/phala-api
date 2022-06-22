# phala-api-template
A template api of phala | PHA 的 API 参考模板

This template is based on the [official console.js](https://github.com/Phala-Network/phala-blockchain/blob/master/scripts/js/src/console.js) | 本模板基于官方 `console.js` 改编

**请确定理解 phala api 的使用方法再进行操作，误操作造成的损失本人概不负责**

---

## Env requirement | 环境要求

* `node` installed | 安装了 `node`
* `npm` installed | 安装了 `npm`
* Able to connect **fully synced** khala node port `9944` | 能连接到**已同步完成**的 khala 节点端口 `9944`

---

#### Test connection of khala node | 节点连接测试方法

Linux system, `curl` & `jq` installed | Linux 系统，且需要已经安装 `curl` 和 `jq`

If node is in another machine, change `localhost` to the IP of the node | 如果节点不在本地，将 `localhost` 改成对应节点所在 IP

```
curl -sH "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "system_syncState", "params":[]}' http://localhost:9933 | jq '.result'
```


## Usage | 使用方法

* First run | 初次安装依赖

```
npm i
```

* Change info in `userInfo.json` | 更改 `userInfo.json` 中的相应信息

```
{
  "mnemonic": "xxxx xxxx xxxx",
  "endpoint": "ws://localhost:9944"
}
```

* Fill in extrinsics in `phala-api.js` | 在 `phala-api.js` 中填写需要进行的交易操作

e.g. send 1 PHA to me | 举例：发送给作者 1 PHA

```
var txs=[
  api.tx.balances.transferKeepAlive("45BsgW5wSLE38P2AeogXRp67wge9pvP1sdm2ZgSWkLEPTBgX",1000000000000)
];
```
All operations that need to fill in the amount of PHA need to be multiplied by 1000000000000 (12 zeros)

所有需要填写 PHA 币量的操作都需要乘以 1000000000000（12 个 0）

* 1.23456789 PHA will be as 1234567890000 | 1.23456789 PHA 写作 1234567890000

---

Support multiple extrinsics | 支持多个不同请求同时发送

```
var txs=[
  api.tx.balances.transferKeepAlive("45BsgW5wSLE38P2AeogXRp67wge9pvP1sdm2ZgSWkLEPTBgX",3000000000000),
  api.tx.balances.transferKeepAlive("4237uB7vhW2XPTVWK6ikTMRHVGWTdXZ6ze5VJ9YVfMvnRoHg",2000000000000),
  api.tx.balances.transferKeepAlive("46C9Bmo9RUJXPd6rv4T3Phx9HEAU7tNbQkbStbrShspHoGq3",1000000000000)
];
```

* Run with node | 运行

```
node phala-api.js --send
```

Without `--send` option will not send on chain, will just retrun the hex of the extrinisics, which can be decoded in [polkadot.js.org/apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkhala-api.phala.network%2Fws#/extrinsics/decode)

不含 `--send` 参数运行时只会返回十六进制编码而不会上链，可以在 [polkadot.js.org/apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkhala-api.phala.network%2Fws#/extrinsics/decode) 进行解码

---
---
# Extrinsics list | 可用交易列表

https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkhala-api.phala.network%2Fws#/extrinsics
