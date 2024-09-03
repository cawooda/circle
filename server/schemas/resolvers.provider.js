const { Provider, User } = require("../models");
module.exports = {
  updateProviderProfile: async (
    _parent,
    { userId, providerId, providerName, abn, termsAndConditions, address },
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

      if (address !== undefined) {
        if (address.street !== undefined)
          provider.address.street = address.street;
        if (address.city !== undefined) provider.address.city = address.city;
        if (address.state !== undefined) provider.address.state = address.state;
        if (address.postalCode !== undefined)
          provider.address.postalCode = address.postalCode;
      }

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
