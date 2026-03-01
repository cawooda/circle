// handles provider-related operations, including complex deletions with transaction support
const { Provider, User, ServiceAgreement, Shift } = require("../models");

async function deleteProvider(providerId) {
  try {
    await session.withTransaction(async () => {
      const provider = await Provider.findById(providerId);
      if (!provider) throw new Error("Provider not found");
      // 1) Clear back-reference on user
      if (provider.user) {
        await User.updateOne(
          { _id: provider.user },
          { $set: { roleProvider: null } },
        );
      }

      // 2) Cleanup related docs/references (example)
      await ServiceAgreement.updateMany(
        { provider: provider._id },
        { $set: { provider: null } },
      );

      await Shift.deleteMany({ provider: provider._id });

      // 3) Delete provider
      await Provider.deleteOne({ _id: provider._id });
    });
  } catch (error) {
    console.error("Error deleting provider:", error);
    throw new Error("Failed to delete provider");
  }

  return { success: true };
}

module.exports = { deleteProvider };
