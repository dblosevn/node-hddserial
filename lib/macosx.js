var exec = require('child_process').exec;
module.exports = function (index, callback) {
    if (typeof index === 'function') {
        callback = index;
    }
    exec(`system_profiler SPUSBDataType -xml`, function (err, out) {
        if (err) {
            callback(err, false);
            return;
        }
        const plist = require('plist');
        let buses = plist.parse(out)[0]._items;
        var Serialnumbers = [];

        for (let bus of buses) {
            for (let device of bus._items) {
                if ('serial_num' in device) {
                    Serialnumbers.push(device.serial_num.substr(0, 20));
                }
            }
        }

        if (Serialnumbers.length > 0) {


            if (typeof index === 'function') {

                callback(null, Serialnumbers);
            } else {
                if (!isNaN(index) && Serialnumbers[index]) {
                    callback(null, Serialnumbers[index]);
                } else {
                    callback('the index must be a number', false)
                }

            }
        } else {
            callback("no hdd serial found !!", null);
        }
    });

};