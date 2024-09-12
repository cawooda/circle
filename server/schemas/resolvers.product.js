const { Provider, Product, Service } = require("../models");

module.exports = {
  getProducts: async (_parent, {}, context) => {
    try {
      const providerId = context.user.roleProvider._id;
      const userServices = await Service.find({ provider: providerId });

      const serviceProductIds = userServices.map((service) => service.product);

      const productList = await Product.find({
        _id: { $nin: serviceProductIds },
      });

      return {
        success: true,
        message: "Product list fetched successfully",
        products: productList || [],
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Product list fetch encountered an error",
        products: [],
      };
    }
  },
};
