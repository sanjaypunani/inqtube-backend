import mongoose from "mongoose";

//  LiveStream Schema
const LiveStreamSchema = mongoose.Schema(
  {
    stream_id: {
      type: mongoose.Schema.Types.String,
    },
    stream_path: {
      type: mongoose.Schema.Types.String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("LiveStream", LiveStreamSchema);
