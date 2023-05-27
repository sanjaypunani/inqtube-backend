import Models from "../src/models";

export const getRandomId = () => {
  return Math.floor(Math.random() * 100000000000 + 1);
};

export const createLiveStream = (data) => {
  return new Promise(async (resolve, reject) => {
    const { stream_id, stream_path } = data;
    const stream = await Models.LiveStream.findOne({
      stream_path: { $eq: stream_path },
    });
    const newData = {
      stream_id,
      stream_path,
    };

    if (stream) {
      //Update
      Models.LiveStream.findOneAndUpdate(
        {
          stream_id: { $eq: stream.stream_id },
        },
        newData
      )
        .then(() => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      //Create
      const newInterest = new Models.LiveStream(newData);
      newInterest.save((saveErr) => {
        if (saveErr) {
          reject(saveErr);
        }
        resolve(data);
      });
    }
  });
};

export const deleteLiveStream = (data) => {
  return new Promise(async (resolve, reject) => {
    const { stream_id } = data;
    Models.LiveStream.findOneAndDelete({
      stream_id: { $eq: stream_id },
    })
      .then(() => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
