const { Provider, User } = require("../models");
module.exports = {
  getMyProvider: async (_parent, {}, context) => {
    try {
      const user = await User.findById(context.user._id);
      if (!user)
        throw new Error("there was no user found in the query context");
      if (!user.roleProvider)
        throw new Error("there was no provider role for that user");
      const provider = await Provider.findById(user.roleProvider._id)
        .populate({
          path: "user",
          model: "user",
        })
        .populate({
          path: "services",
          model: "service",
          populate: { path: "product", model: "product" },
        })
        .populate({
          path: "shifts",
          model: "shift",
          populate: { path: "service", model: "service" },
        })
        .populate({
          path: "linkedCustomers",
          model: "customer",
          populate: { path: "user", model: "user" },
        })
        .exec();
      if (!provider)
        throw new Error(
          "we couldt get a provider when we tried the user's roleProvider id"
        );

      return provider.toObject();
    } catch (error) {
      console.log("error in resolvers.provider", error.message);
      throw error;
    }
  },
  updateProviderProfile: async (
    _parent,
    {
      userId,
      providerId,
      providerName,
      abn,
      termsAndConditions,
      address,
      logoUrl,
    },
    context
  ) => {
    try {
      // Find the user and ensure they have the provider role
      const user = await User.findById(userId);
      if (
        !user ||
        !user.roleProvider ||
        user.roleProvider._id.toString() !== providerId
      ) {
        throw new Error(
          "User does not have permission to update this provider"
        );
      }

      // Find the provider by ID
      const provider = await Provider.findById(providerId);
      if (!provider) {
        throw new Error("Provider not found");
      }

      // Update provider fields if they are provided (not undefined)
      if (providerName !== undefined) {
        provider.providerName = providerName;
      }

      if (abn !== undefined) {
        provider.abn = abn;
      }

      if (termsAndConditions !== undefined) {
        provider.termsAndConditions = termsAndConditions;
      }

      if (logoUrl !== undefined) {
        provider.logoUrl = logoUrl;
      }

      if (address !== undefined) {
        if (address.street !== undefined)
          provider.address.street = address.street;
        if (address.city !== undefined) provider.address.city = address.city;
        if (address.state !== undefined) provider.address.state = address.state;
        if (address.postalCode !== undefined)
          provider.address.postalCode = address.postalCode;
      }
      provider.services = provider?.services.filter((service) => {
        if (service.product.name) {
          return true;
        }
      });
      // Save the updated provider
      const updatedProvider = await provider.save();

      // Return the updated provider
      return updatedProvider;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update provider profile");
    }
  },
};
