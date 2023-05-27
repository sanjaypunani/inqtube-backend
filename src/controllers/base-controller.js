import Models from "../models";

const baseController = {
  index: (req, res) => {
    return res.status(200).json({
      success: true,
      message: ":)",
    });
  },

  createInterest: (req, res) => {
    const { name } = req.body;
    const file = req.file;
    let icon;
    if (file) {
      icon = `uploads/${file.filename}`;
    }
    const data = {
      name,
      icon,
    };
    const newInterest = new Models.Interest(data);
    newInterest.save((saveErr) => {
      if (saveErr) {
        return res.status(412).send({
          success: false,
          message: saveErr,
        });
      }
      return res.status(200).json({
        success: true,
        message: "interest create successful",
      });
    });
  },

  getLiveStreams: (req, res) => {
    Models.LiveStream.find(function (err, list) {
      if (!err) {
        return res.status(200).json({
          success: true,
          message: "Get stremams successfully",
          data: list,
        });
      } else {
      }
    });
  },

  updateUser: (req, res) => {
    const userId = req.user.id;
    const query = { $_id: { $eq: userId } };
    Models.User.findOneAndUpdate(query, req.body, function (err, list) {
      if (!err) {
        return res.status(200).json({
          success: true,
          message: "Update profile successfully",
          data: list,
        });
      } else {
      }
    });
  },
};

export default baseController;
