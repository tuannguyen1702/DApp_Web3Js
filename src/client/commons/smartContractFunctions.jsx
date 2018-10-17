
  export const deploySmartContract = async (web3, transactionObject, abi, argumentArr, privateKey = null) => {
    var self = this

    var mozotokenContract = new web3.eth.Contract(abi);
    const encodeABIData = mozotokenContract.deploy({
      data: transactionObject.data,
      arguments: argumentArr
    }).encodeABI();

    transactionObject.data = encodeABIData

    const transactionCallBack = (hash) => {
      var checkHash = setInterval(() => {
        web3.eth.getTransactionReceipt(hash).then((resultHash) => {
          if (resultHash) {
            //console.log(resultHash)
            clearInterval(checkHash)
          } else {
            //console.log("Waiting confirm....")
          }
        })
      }, 2000);
    }

    if(privateKey == null) {
      return new Promise((resolve, reject) => {
        web3.eth.sendTransaction(transactionObject)
          .on('transactionHash', function (hash) {
            transactionCallBack(hash)
            console.log(hash)
            resolve(hash);
          })
          .on('error', function (err) {
            console.log(err)
            //reject(err);
            resolve("error");
          })
      })
    } else {
      const account = web3.eth.accounts.privateKeyToAccount(privateKey)
      account.signTransaction(transactionObject).then((data) => {
        console.log(data)
  
        return new Promise((resolve, reject) => {
          web3.eth.sendSignedTransaction(data.rawTransaction || data.raw)
            .on('transactionHash', function (hash) {
              transactionCallBack(hash)
              console.log(hash)
              resolve(hash);
            })
            .on('error', function (err) {
              console.log(err)
              reject(err);
            })
        })
      });
    }
  }