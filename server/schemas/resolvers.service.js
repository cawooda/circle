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
  addService: async (_parent, { providerId, productId }) => {
    try {
      // Find the provider and product by their IDs
      const provider = await Provider.findById(providerId);
      const product = await Product.findById(productId);

      if (!provider) throw new Error(`${providerId} not found`);
      if (!product) throw new Error(`${productId} not found`);

      // Create the new service
      const addedService = await Service.create({
        provider: providerId,
        product: productId,
        price: product.price,
      });
      if (!addedService) throw new Error(`we couldnt create a service`);

      provider.services.push(addedService._id);
      await provider.save();

      // Populate the service with the provider and product data
      await addedService.populate("provider product");

      return {
        success: true,
        message: "Service successfully created",
        service: addedService,
      };
    } catch (error) {
      if (error.code === 11000) {
        return {
          success: false,
          message:
            "A provider can only have one service of the same product name",
        };
      }
      console.log(error);
      return {
        success: false,
        message: "An error occurred while creating the service",
      };
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
    updatedService.save();
    await updatedService.populate("product provider");
    return updatedService;
  },
};
