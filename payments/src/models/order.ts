import mongoose from 'mongoose';
import {OrderStatus} from '@microservices-loop/common'

import {updateIfCurrentPlugin} from 'mongoose-update-if-current'

export {OrderStatus}
interface OrderAttrs {
    id: string;
    status: OrderStatus;
    version: number;
    price: number;
    userId: string;

}
interface OrderDoc extends mongoose.Document {
    status: OrderStatus;
    version: number;
    price: number;
    userId: string;
   
}
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}


const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    price: {
        type: Number
    }
}, {
    toJSON: {
        transform(doc,ret) {
            ret.id = ret._id;
            delete ret._id;
            
        }
    }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);
orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        version:attrs.version,
        price: attrs.price,
        userId: attrs.userId,
        status: attrs.status
    })
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);
export { Order }

