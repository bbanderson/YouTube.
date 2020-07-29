import mongoose from "mongoose";

const SubscribeSchema = new mongoose.Schema({
    subscribedAt: {
        type: Date,
        default: Date.now
    },
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    target: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const model = mongoose.model("Subscribe", SubscribeSchema);

export default model;