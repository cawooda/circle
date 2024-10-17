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
      logo,
    },
    context
  ) => {
    try {
      // Find the user and ensure they have the provider role
      const user = await User.findById(userId);
      if (
        !user?.roleProvider ||
        user.roleProvider._id.toString() !== providerId
      ) {
        throw new GraphQLError(
          "User does not have permission to update this provider."
        );
      }

      // Update provider fields if they are provided (not undefined)
      // Find the provider
      const provider = await Provider.findById(providerId);
      if (!provider) {
        throw new GraphQLError("Provider not found.");
      }

      // Prepare the update object only with the fields provided
      const updatedFields = {
        ...(providerName && { providerName }),
        ...(abn && { abn }),
        ...(termsAndConditions && { termsAndConditions }),
        ...(logo && { logoUrl: logo }), // Store the logo as Base64 or URL
        address: {
          ...provider.address,
          ...address, // Merge new address fields with existing ones
        },
      };

      // Update the provider with new fields
      Object.assign(provider, updatedFields);

      // Optional: Filter out services with missing product names
      provider.services = provider.services?.filter(
        (service) => !!service.product?.name
      );

      // Save the updated provider
      const updatedProvider = await provider.save();
      return updatedProvider;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update provider profile");
    }
  },
};
