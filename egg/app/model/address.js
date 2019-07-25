// 用户表
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const AddressSchema = new Schema({
        userName: String,            // 用户名
        name: String,               // 收货人姓名
        tel: String,                // 电话
        isDefault: {
            type: Boolean,
            default: false
        },          // 是否默认,
        area: String,                // 地区
        addressDetail: String,      // 详细地址  
        add_time: {
            type: Number,
            default: +new Date()
        }
    });

    return mongoose.model('Address', AddressSchema, 'address');
}