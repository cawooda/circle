exports.postData = async (req, res, next) => {
  //CREATE
};

exports.getData = async (req, res, next) => {
  console.log("get data called");
  res.json({ message: "getData called" });
};

exports.putData = async (req, res, next) => {
  //UPDATE
};

exports.deleteData = async (req, res, next) => {
  //DELETE
};
