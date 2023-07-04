/********************************************************************************
*   Ledger Communication toolkit
*   (c) 2016 Ledger
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License.
********************************************************************************/

let LedgerEth = function(comm) {
	this.comm = comm;
}

LedgerEth.splitPath = function(path) {
	let result = [];
	let components = path.split('/');
	components.forEach(function (element, index) {
		let number = parseInt(element, 10);
		if (isNaN(number)) {
			return;
		}
		if ((element.length > 1) && (element[element.length - 1] === "'")) {
			number += 0x80000000;
		}
		result.push(number);
	});
	return result;
}

// callback is function(response, error)
LedgerEth.prototype.getAddress = function(path, callback, boolDisplay, boolChaincode) {
	let splitPath = LedgerEth.splitPath(path);
	let buffer = new Buffer(5 + 1 + splitPath.length * 4);
	buffer[0] = 0xe0;
	buffer[1] = 0x02;
	buffer[2] = (boolDisplay ? 0x01 : 0x00);
	buffer[3] = (boolChaincode ? 0x01 : 0x00);
	buffer[4] = 1 + splitPath.length * 4;
	buffer[5] = splitPath.length;
	splitPath.forEach(function (element, index) {
		buffer.writeUInt32BE(element, 6 + 4 * index);
	});
	let self = this;
	let localCallback = function(response, error) {
		if (typeof error !== "undefined") {
			callback(undefined, error);
		}
		else {
			let result = {};
			response = new Buffer(response, 'hex');
			let sw = response.readUInt16BE(response.length - 2);
			if (sw !== 0x9000) {
				callback(undefined, "Invalid status " + sw.toString(16) + ". Check to make sure the right application is selected ?");
				return;
			}
			let publicKeyLength = response[0];
			let addressLength = response[1 + publicKeyLength];
			result['publicKey'] = response.slice(1, 1 + publicKeyLength).toString('hex');
			result['address'] = "0x" + response.slice(1 + publicKeyLength + 1, 1 + publicKeyLength + 1 + addressLength).toString('ascii');
			if (boolChaincode) {
				result['chainCode'] = response.slice(1 + publicKeyLength + 1 + addressLength, 1 + publicKeyLength + 1 + addressLength + 32).toString('hex');
			}
			callback(result);
		}
	};
	this.comm.exchange(buffer.toString('hex'), localCallback);
}

// callback is function(response, error)
LedgerEth.prototype.signTransaction = function(path, rawTxHex, callback) {
	let splitPath = LedgerEth.splitPath(path);
	let offset = 0;
	let rawTx = new Buffer(rawTxHex, 'hex');
	let apdus = [];
	while (offset !== rawTx.length) {
		let maxChunkSize = (offset === 0 ? (150 - 1 - splitPath.length * 4) : 150)
		let chunkSize = (offset + maxChunkSize > rawTx.length ? rawTx.length - offset : maxChunkSize);
		let buffer = new Buffer(offset === 0 ? 5 + 1 + splitPath.length * 4 + chunkSize : 5 + chunkSize);
		buffer[0] = 0xe0;
		buffer[1] = 0x04;
		buffer[2] = (offset === 0 ? 0x00 : 0x80);
		buffer[3] = 0x00;
		buffer[4] = (offset === 0 ? 1 + splitPath.length * 4 + chunkSize : chunkSize);
		if (offset === 0) {
			buffer[5] = splitPath.length;
			splitPath.forEach(function (element, index) {
				buffer.writeUInt32BE(element, 6 + 4 * index);
			});
			rawTx.copy(buffer, 6 + 4 * splitPath.length, offset, offset + chunkSize);
		}
		else {
			rawTx.copy(buffer, 5, offset, offset + chunkSize);
		}
		apdus.push(buffer.toString('hex'));
		offset += chunkSize;
	}
	let self = this;
	let localCallback = function(response, error) {
		if (typeof error !== "undefined") {
			callback(undefined, error);
		}
		else {
			response = new Buffer(response, 'hex');
			let sw = response.readUInt16BE(response.length - 2);
			if (sw !== 0x9000) {
        callback(undefined, "Invalid status " + sw.toString(16) + ". Check to make sure contract data is on ?");
				return;
			}
			if (apdus.length === 0) {
					let result = {};
					result['v'] = response.slice(0, 1).toString('hex');
					result['r'] = response.slice(1, 1 + 32).toString('hex');
					result['s'] = response.slice(1 + 32, 1 + 32 + 32).toString('hex');
					callback(result);
			}
			else {
				self.comm.exchange(apdus.shift(), localCallback);
			}
		}
	};
	self.comm.exchange(apdus.shift(), localCallback);
}

// callback is function(response, error)
LedgerEth.prototype.getAppConfiguration = function(callback) {
	let buffer = new Buffer(5);
	buffer[0] = 0xe0;
	buffer[1] = 0x06;
	buffer[2] = 0x00;
	buffer[3] = 0x00;
	buffer[4] = 0x00;
	let localCallback = function(response, error) {
		if (typeof error !== "undefined") {
			callback(undefined, error);
		}
		else {
			response = new Buffer(response, 'hex');
			let result = {};
			let sw = response.readUInt16BE(response.length - 2);
			if (sw !== 0x9000) {
				callback(undefined, "Invalid status " + sw.toString(16) + ". Check to make sure the right application is selected ?");
				return;
			}
			result['arbitraryDataEnabled'] = (response[0] & 0x01);
			result['version'] = "" + response[1] + '.' + response[2] + '.' + response[3];
			callback(result);
		}
	};
	this.comm.exchange(buffer.toString('hex'), localCallback);
}

LedgerEth.prototype.signPersonalMessage_async = function(path, messageHex, callback) {
  let splitPath = LedgerEth.splitPath(path);
  let offset = 0;
  let message = new Buffer(messageHex, 'hex');
  let apdus = [];
  let response = [];
  let self = this;
  while (offset !== message.length) {
    let maxChunkSize = (offset === 0 ? (150 - 1 - splitPath.length * 4 - 4) : 150)
    let chunkSize = (offset + maxChunkSize > message.length ? message.length - offset : maxChunkSize);
    let buffer = new Buffer(offset === 0 ? 5 + 1 + splitPath.length * 4 + 4 + chunkSize : 5 + chunkSize);
    buffer[0] = 0xe0;
    buffer[1] = 0x08;
    buffer[2] = (offset === 0 ? 0x00 : 0x80);
    buffer[3] = 0x00;
    buffer[4] = (offset === 0 ? 1 + splitPath.length * 4 + 4 + chunkSize : chunkSize);
    if (offset === 0) {
      buffer[5] = splitPath.length;
      splitPath.forEach(function (element, index) {
        buffer.writeUInt32BE(element, 6 + 4 * index);
      });
      buffer.writeUInt32BE(message.length, 6 + 4 * splitPath.length);
      message.copy(buffer, 6 + 4 * splitPath.length + 4, offset, offset + chunkSize);
    }
    else {
      message.copy(buffer, 5, offset, offset + chunkSize);
    }
    apdus.push(buffer.toString('hex'));
    offset += chunkSize;
  }
  let localCallback = function(response, error) {
    if (typeof error !== "undefined") {
      callback(undefined, error);
    }
    else {
      response = new Buffer(response, 'hex');
      let sw = response.readUInt16BE(response.length - 2);
      if (sw !== 0x9000) {
        callback(undefined, "Invalid status " + sw.toString(16) + ". Check to make sure the right application is selected ?");
        return;
      }
      if (apdus.length === 0) {
          let result = {};
          result['v'] = response.slice(0, 1).toString('hex');
          result['r'] = response.slice(1, 1 + 32).toString('hex');
          result['s'] = response.slice(1 + 32, 1 + 32 + 32).toString('hex');
          callback(result);
      }
      else {
        self.comm.exchange(apdus.shift(), localCallback);
      }
    }
  };
  self.comm.exchange(apdus.shift(), localCallback);
}

module.exports = LedgerEth;
// export default LedgerEth

