const fs = require('fs');
const {
    program
} = require('commander');
const {
    ApiPromise,
    Keyring,
    WsProvider
} = require('@polkadot/api');
const {
    cryptoWaitReady,
    blake2AsHex
} = require('@polkadot/util-crypto');
const {
    numberToHex,
    hexToU8a,
    u8aConcat,
    u8aToHex
} = require('@polkadot/util');

const userInfoRaw = fs.readFileSync("userInfo.json");
const userInfo = JSON.parse(userInfoRaw);

function run(afn) {
    function runner(...args) {
        afn(...args)
            .then(process.exit)
            .catch(console.error)
            .finally(() => process.exit(-1));
    };
    return runner;
}

async function useApi() {
    let {
        ws,
        substrateNoRetry,
        at
    } = program.opts();
    const wsProvider = new WsProvider(ws);
    const api = await ApiPromise.create({
        provider: wsProvider,
        throwOnConnect: !substrateNoRetry,
    });
    if (at) {
        if (!at.startsWith('0x') && !isNaN(at)) {
            // Get the block hash at some height
            at = (await api.rpc.chain.getBlockHash(at)).toString();
        }
        console.debug('Accessing the data at:', at);
        return await api.at(at);
    }
    return api;
}

// Gets the default key pair and the keyring
async function useKey() {
    await cryptoWaitReady();
    const keyring = new Keyring({
        type: 'sr25519'
    });
    const pair = keyring.createFromUri(userInfo.mnemonic);
    keyring.setSS58Format(30);
    return {
        pair
    };
}

// Prints the tx or send it to the blockchain based on user's config
async function printTxOrSend(call) {
    if (program.opts().send) {
        const {
            pair
        } = await useKey();
        // const r = await call.signAndSend(pair, );
        // How to specify {nonce: -1}?
        const unsub = await call.signAndSend(pair, ({
            status
        }) => {
            if (status.isInBlock) {
                console.log(colors.green('included in block'));
            }
        });
        printObject(unsub, 4);
    } else {
        console.log(call.toHex());
    }
}

function printObject(obj, depth = 3, getter = true) {
    if (program.opts().json) {
        console.log(JSON.stringify(obj, undefined, 2));
    } else {
        console.dir(obj, {
            depth,
            getter
        });
    }
}

program
    .option('--ws <url>', 'Substrate WS endpoint', process.env.ENDPOINT || userInfo.endpoint)
    .option('--substrate-no-retry', false)
    .option('--send', 'send the transaction instead of print the hex')
    .option('--json', 'output regular json', false)
    .action(run(async () => {
        const api = await useApi();
		const txs = [
			api.tx.balances.transferKeepAlive('45BsgW5wSLE38P2AeogXRp67wge9pvP1sdm2ZgSWkLEPTBgX', 1000000000000)
		];
        const call = api.tx.utility.batch(txs);
        await printTxOrSend(call);
    }));

program.parse(process.argv);
