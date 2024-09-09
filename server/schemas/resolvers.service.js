const { Provider, Product, Service } = require("../models");
module.exports = {
  getServices: async (_parent, { providerId }, context) => {
    try {
      if (context.user.roleProvider._id == providerId) {
        const foundServices = await Service.find({
          provider: providerId,
        }).populate({
          path: "product",
          model: "product",
        });

        return {
          success: true,
          message: "we successfully found a list of providers servcies",
          services: foundServices,
        };
      } else {
        return {
          success: false,
          message: "You can only query your own services",
          services: [],
        };
      }
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "an error occurred getting services for provider",
      };
    }
  },
  addService: async (_parent, { providerId, productId, price }) => {
    //Look int unique keys multiple fields mongoose.
    // tell the front end guys to check whether the provider already has a service before adding one that could be a duplicate
    // front end should check that the returned object contains data property
    try {
      const provider = await Provider.findById(providerId);
      const product = await Product.findById(productId);
      const addedService = await Service.create({ provider, product, price });
      await addedService.populate("provider product");

      return {
        success: true,
        message: "service successfully created",
        service: addedService,
      };
    } catch (error) {
      if (error.code === 11000) {
        return {
          success: false,
          message:
            "a provider can only have one service of the same product name",
        };
      }
      console.log(error);
    }
  },
  deleteService: async (_parent, { serviceId }) => {
    const deletedService = await Service.findOneAndDelete({ _id: serviceId });
    await deletedService.populate("product provider");
    return deletedService;
  },
  updateServicePrice: async (_parent, { serviceId, price }) => {
    const updatedService = await Service.findById(serviceId);
    updatedService.price = price;
    await updatedService.populate("product provider");
    return updatedService;
  },
};
